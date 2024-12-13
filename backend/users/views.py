from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
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
    招待リンクを生成して送信するエンドポイント
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')  # 招待先のメールアドレス
            group_id = data.get('group_id')  # 家族グループのID

            # 必要なデータがない場合はエラーを返す
            if not email or not group_id:
                return JsonResponse({"error": "Email and group_id are required."}, status=400)

            # 招待トークンを生成
            from django.utils.crypto import get_random_string
            from django.utils.timezone import now, timedelta
            from .models import Invitations, FamilyGroup

            token = get_random_string(length=32)
            expires_at = now() + timedelta(days=7)

            # 家族グループが存在するか確認
            group = FamilyGroup.objects.filter(id=group_id).first()
            if not group:
                return JsonResponse({"error": "Group not found."}, status=404)

            # 招待をデータベースに保存
            invitation = Invitations.objects.create(
                group=group,
                email=email,
                token=token,
                expires_at=expires_at
            )

            # 招待リンクを生成
            invite_link = f"http://localhost:8000/users/accept_invite/{token}"

            # 本番ではメール送信機能を追加
            # send_email_function(email, invite_link)

            return JsonResponse({"invite_link": invite_link, "message": "Invitation sent successfully."}, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid HTTP method."}, status=405)

#招待リンク処理エンドポイントの追加
@csrf_exempt
def accept_invite(request, token):
    """
    招待リンクを受け入れるエンドポイント
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_id = data.get('user_id')  # 招待を受け入れるユーザーのID

            if not user_id:
                return JsonResponse({"error": "User ID is required."}, status=400)

            # 招待を検索
            from django.utils.timezone import now
            from .models import Invitations, FamilyMembers

            invitation = Invitations.objects.filter(token=token).first()
            if not invitation:
                return JsonResponse({"error": "Invalid invitation token."}, status=404)

            # 招待が期限切れでないか確認
            if invitation.expires_at < now():
                return JsonResponse({"error": "Invitation token has expired."}, status=400)

            # 家族グループにユーザーを追加
            FamilyMembers.objects.create(
                group_id=invitation.group.id,
                user_id=user_id
            )

            # 招待ステータスを更新
            invitation.status = "accepted"
            invitation.save()

            return JsonResponse({"message": "Invitation accepted successfully."}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid HTTP method."}, status=405)
