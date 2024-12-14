from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from django.utils.timezone import now, timedelta
from django.utils.decorators import method_decorator
from django.contrib.auth.hashers import make_password  # パスワードハッシュ化のため
import json
from .models import User

@method_decorator(csrf_exempt, name='dispatch')  # CSRFを無効化（必要ならToken認証を追加）
def register_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_name = data['user_name']
            email = data['email']
            password = data['password']

            # ユーザーが既に存在するか確認
            if User.objects.filter(email=email).exists():
                return JsonResponse({"error": "User with this email already exists."}, status=400)

            # パスワードをハッシュ化して保存
            hashed_password = make_password(password)

            # 新しいユーザーを作成
            user = User.objects.create(
                user_name=user_name,
                email=email,
                password=hashed_password
            )
            user.save()

            return JsonResponse({"message": "User registered successfully."}, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid HTTP method."}, status=405)

@csrf_exempt
def get_user(request):
    """
    ログイン中のユーザー情報を取得するエンドポイント
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')

            # メールアドレスが提供されていない場合
            if not email:
                return JsonResponse({"error": "Email is required."}, status=400)

            # データベースからユーザーを検索
            user = User.objects.filter(email=email).first()
            if not user:
                return JsonResponse({"error": "User not found."}, status=404)

            # ユーザー情報を返す
            return JsonResponse({
                "user_name": user.user_name,
                "email": user.email
            }, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid HTTP method."}, status=405)
    
# 招待リンク生成エンドポイントの追加
@csrf_exempt
def send_invite(request):
    """
    招待リンクを生成してメールを送信するエンドポイント
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            group_id = data.get('group_id')  # 必要ならグループ情報をフロントエンドから送信

            # 必要なデータがない場合
            if not email:
                return JsonResponse({"error": "Email is required."}, status=400)

            token = get_random_string(length=32)
            expires_at = now() + timedelta(days=7)

            # グループが存在するか確認
            group = FamilyGroup.objects.filter(id=group_id).first()
            if not group:
                return JsonResponse({"error": "Group not found."}, status=404)

            # 招待を保存
            invitation = Invitations.objects.create(
                group=group,
                email=email,
                token=token,
                expires_at=expires_at
            )

            # 招待リンクを生成
            invite_link = f"http://localhost:3000/register?token={token}"

            # 招待メールを送信
            send_mail(
                "招待リンク",
                f"以下のリンクから登録を完了してください:\n\n{invite_link}",
                "noreply@example.com",
                [email],
                fail_silently=False,
            )

            return JsonResponse({"message": "招待メールを送信しました。"}, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid HTTP method."}, status=405)

@csrf_exempt
def accept_invite(request):
    """
    招待リンクのトークンを検証し、新規登録に進む
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            token = data.get('token')

            # トークンがない場合
            if not token:
                return JsonResponse({"error": "Token is required."}, status=400)

            # トークンの検証
            invitation = Invitations.objects.filter(token=token).first()
            if not invitation:
                return JsonResponse({"error": "Invalid token."}, status=404)

            # トークンが期限切れか確認
            if invitation.expires_at < now():
                return JsonResponse({"error": "Token has expired."}, status=400)

            # トークンが有効な場合は新規登録に進む（フロントエンドで処理）
            return JsonResponse({"message": "Token is valid."}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid HTTP method."}, status=405)