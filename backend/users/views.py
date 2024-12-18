from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from django.utils.timezone import now, timedelta
from django.utils.decorators import method_decorator
from django.contrib.auth.hashers import make_password  # パスワードハッシュ化のため
import json
from .models import User
from family.models import FamilyGroup, FamilyMember, Invitation
from firebase_admin import auth
import os 
import firebase_admin
from firebase_admin import credentials

# 環境変数からサービスアカウントキーのパスを取得
service_account_key_path = '/app/firebase-adminsdk.json'

# サービスアカウントキーを使って初期化
cred = credentials.Certificate(service_account_key_path)
firebase_admin.initialize_app(cred)

@method_decorator(csrf_exempt, name='dispatch')  # CSRFを無効化（必要ならToken認証を追加）
def register_user(request):
    """
    親ユーザーが新規登録時にグループを作成し、そのユーザーをグループに追加する
    招待リンクも生成し、返す
    """
    if request.method == 'POST':
        try:
            # リクエストデータを取得
            data = json.loads(request.body)
            user_name = data['user_name']
            email = data['email']
            password = data['password']
            firebase_uid = data['firebase_uid']  # Firebase UIDを受け取る
            group_name = data['group_name']  # 親ユーザーが指定するグループ名

            # Firebase UID でユーザーを検索
            if not firebase_uid:
                return JsonResponse({"error": "Firebase UID is required."}, status=400)
            
            # ユーザーが既に存在するか確認
            if User.objects.filter(email=email).exists():
                return JsonResponse({"error": "User with this email already exists."}, status=400)

            # パスワードをハッシュ化して保存
            hashed_password = make_password(password)

            # 新しいユーザーを作成
            user = User.objects.create(
                user_name=user_name,
                email=email,
                password=hashed_password,
                firebase_uid=firebase_uid  # Firebase UIDをDjangoユーザーに保存
            )
            user.save()

            # 親ユーザーが指定したグループを作成
            group, created = FamilyGroup.objects.get_or_create(name=group_name, owner=user)  # グループを作成、オーナーにユーザーを設定

            # ユーザーをFamilyMemberとしてグループに追加
            FamilyMember.objects.create(group=group, user=user)

            # 招待リンクを生成
            token = get_random_string(length=32)
            expires_at = now() + timedelta(days=7)

            # 招待情報を作成
            invitation = Invitation.objects.create(group=group, token=token, expires_at=expires_at)

            invite_link = f"http://localhost:3000/invite_accept?token={token}"

            return JsonResponse({
                "message": "User and group created successfully.",
                "inviteLink": invite_link
            }, status=201)

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
    
@csrf_exempt
def accept_invite(request):
    """
    招待リンクを使って新規ユーザー登録し、グループに追加する
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            token = data.get('token')  # 招待リンクからのトークン
            user_name = data.get('user_name')
            email = data.get('email')
            password = data.get('password')

            # トークンが提供されていない場合
            if not token or not user_name or not email or not password:
                return JsonResponse({"error": "トークン、ユーザー名、メールアドレス、パスワードが必要です。"}, status=400)

            # トークンを検証
            invitation = Invitation.objects.filter(token=token).first()
            if not invitation:
                return JsonResponse({"error": "無効なトークンです。"}, status=400)

            if invitation.expires_at < now():
                return JsonResponse({"error": "トークンが期限切れです。"}, status=400)

            # ユーザーを作成
            user = User.objects.create(
                user_name=user_name,
                email=email,
                password=make_password(password),  # パスワードをハッシュ化して保存
                firebase_uid=email  # 仮にemailをfirebase_uidとして使用
            )
            user.save()

            # グループにユーザーを追加
            FamilyMember.objects.create(group=invitation.group, user=user)

            # 招待のステータスを更新
            invitation.status = "accepted"
            invitation.invited_user = user
            invitation.save()

            return JsonResponse({"message": "グループに参加しました。"}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid HTTP method."}, status=405)