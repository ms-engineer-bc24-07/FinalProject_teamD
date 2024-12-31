from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from django.utils.timezone import now, timedelta
from django.utils.decorators import method_decorator
from django.contrib.auth.hashers import make_password  # パスワードハッシュ化のため
import json
from rest_framework.views import APIView
from rest_framework.response import Response
#from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import User
from rest_framework import status
from family.models import FamilyGroup, FamilyMember, Invitation
from firebase_admin import auth as firebase_auth
import os 

from django.db import transaction
from django.db.utils import IntegrityError
import logging


# # 環境変数からサービスアカウントキーのパスを取得  (消しても良いかも　りな)
# service_account_key_path = '/app/firebase-adminsdk.json'

# # サービスアカウントキーを使って初期化  (消しても良いかも　りな)
# if not firebase_admin._apps:
#     cred = credentials.Certificate(service_account_key_path)
#     firebase_admin.initialize_app(cred)


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
                "email": user.email,
                "icon_url": user.icon_url  # 修正ポイント: icon_url を含める
            }, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid HTTP method."}, status=405)

logger = logging.getLogger(__name__)

@csrf_exempt
def accept_invite(request):
    """
    招待リンクを使って新規ユーザー登録し、グループに追加する
    既存ユーザーの場合、そのユーザーをグループに追加
    """
    if request.method == 'POST':
        logger.info("Accept invite process が開始しました")
        try:
            # リクエストデータを取得
            data = json.loads(request.body)
            token = data.get('token')  # 招待リンクからのトークン
            user_name = data.get('user_name')
            email = data.get('email')
            password = data.get('password')
            firebase_uid = data.get('firebase_uid')  # Firebase UIDを受け取る

            # ログにリクエストデータを出力
            logger.debug(f"Received data: {data}")

            # トークン、ユーザー名、メールアドレス、パスワード、Firebase UIDが必要
            if not token or not user_name or not email or not password or not firebase_uid:
                logger.error("Missing required fields: token, user_name, email, password, or firebase_uid")
                return JsonResponse({"error": "トークン、ユーザー名、メールアドレス、パスワード、Firebase UIDが必要です。"}, status=400)

            # トークンを検証
            invitation = Invitation.objects.filter(token=token).first()
            if not invitation:
                logger.error(f"Invalid token: {token}")
                return JsonResponse({"error": "無効なトークンです。"}, status=400)

            if invitation.expires_at < now():
                logger.warning(f"Expired token: {token}")
                return JsonResponse({"error": "トークンが期限切れです。"}, status=400)

            # emailで既存ユーザーを検索
            user = User.objects.filter(email=email).first()

        

            # Django DBで新規ユーザーを作成
            user = User.objects.create(
                user_name=user_name,
                email=email,
                password=make_password(password),  # パスワードをハッシュ化して保存
                firebase_uid=firebase_uid  # Firebase UIDをDjangoユーザーに保存
            )
            user.save()
            logger.info(f"User created: {user.user_name}")

            # グループにユーザーを追加
            FamilyMember.objects.create(group=invitation.group, user=user)
            logger.info(f"User added to group: {invitation.group.name}")

            # 招待のステータスを更新
            invitation.status = "accepted"
            invitation.invited_user = user
            invitation.save()
            logger.info(f"Invitation accepted for user: {user.user_name}")

            return JsonResponse({"message": f"新しいユーザー「{user_name}」が「{invitation.group.name}」グループに参加しました。"}, status=200)

        except IntegrityError as e:
            logger.error(f"Integrity error: {str(e)}")
            return JsonResponse({"error": "ユーザーの重複登録が発生しました。別のユーザー名を試してください。"}, status=400)
        except Exception as e:
            logger.error(f"Error: {str(e)}")
            return JsonResponse({"error": str(e)}, status=500)
    else:
        logger.error("Invalid HTTP method")
        return JsonResponse({"error": "Invalid HTTP method."}, status=405)

logger = logging.getLogger(__name__)


@csrf_exempt
def accept_invite(request):
    """
    招待リンクを使って新規ユーザー登録し、グループに追加する
    既存ユーザーの場合、そのユーザーをグループに追加
    """
    if request.method == 'POST':
        logger.info("Accept invite process が開始しました")
        try:
            # リクエストデータを取得
            data = json.loads(request.body)
            token = data.get('token')  # 招待リンクからのトークン
            user_name = data.get('user_name')
            email = data.get('email')
            password = data.get('password')
            firebase_uid = data.get('firebase_uid')  # Firebase UIDを受け取る

            # ログにリクエストデータを出力
            logger.debug(f"Received data: {data}")

            # トークン、ユーザー名、メールアドレス、パスワード、Firebase UIDが必要
            if not token or not user_name or not email or not password or not firebase_uid:
                logger.error("Missing required fields: token, user_name, email, password, or firebase_uid")
                return JsonResponse({"error": "トークン、ユーザー名、メールアドレス、パスワード、Firebase UIDが必要です。"}, status=400)

            # トークンを検証
            invitation = Invitation.objects.filter(token=token).first()
            if not invitation:
                logger.error(f"Invalid token: {token}")
                return JsonResponse({"error": "無効なトークンです。"}, status=400)

            if invitation.expires_at < now():
                logger.warning(f"Expired token: {token}")
                return JsonResponse({"error": "トークンが期限切れです。"}, status=400)

            # emailで既存ユーザーを検索
            user = User.objects.filter(email=email).first()

        

            # Django DBで新規ユーザーを作成
            user = User.objects.create(
                user_name=user_name,
                email=email,
                password=make_password(password),  # パスワードをハッシュ化して保存
                firebase_uid=firebase_uid  # Firebase UIDをDjangoユーザーに保存
            )
            user.save()
            logger.info(f"User created: {user.user_name}")

            # グループにユーザーを追加
            FamilyMember.objects.create(group=invitation.group, user=user)
            logger.info(f"User added to group: {invitation.group.name}")

            # 招待のステータスを更新
            invitation.status = "accepted"
            invitation.invited_user = user
            invitation.save()
            logger.info(f"Invitation accepted for user: {user.user_name}")

            return JsonResponse({"message": f"新しいユーザー「{user_name}」が「{invitation.group.name}」グループに参加しました。"}, status=200)

        except IntegrityError as e:
            logger.error(f"Integrity error: {str(e)}")
            return JsonResponse({"error": "ユーザーの重複登録が発生しました。別のユーザー名を試してください。"}, status=400)
        except Exception as e:
            logger.error(f"Error: {str(e)}")
            return JsonResponse({"error": str(e)}, status=500)
    else:
        logger.error("Invalid HTTP method")
        return JsonResponse({"error": "Invalid HTTP method."}, status=405)


class UpdateIconAPIView(APIView):
    # permission_classes = [IsAuthenticated]  # 一旦コメントアウト

    def post(self, request):
        print("POST リクエスト受信:", request.data)
        try:
            # Firebaseトークンからユーザーを取得
            token = request.headers.get("Authorization", "").split(" ")[1]
            print("受信したトークン:", token)

            decoded_token = firebase_auth.verify_id_token(token)
            firebase_uid = decoded_token.get("uid")
            print("Firebase UID:", firebase_uid)

            # Firebase UIDからユーザーを取得
            user = User.objects.filter(firebase_uid=firebase_uid).first()
            if not user:
                print("ユーザーが見つかりません")
                return Response({"error": "ユーザーが見つかりません。"}, status=status.HTTP_404_NOT_FOUND)

            # リクエストデータからアイコンURLを取得
            icon_url = request.data.get("icon")
            if not icon_url:
                print("アイコンURLが提供されていません")
                return Response({"error": "アイコンURLが提供されていません。"}, status=status.HTTP_400_BAD_REQUEST)

            # ユーザーのアイコンを更新
            user.icon_url = icon_url
            user.save()
            print(f"ユーザー {user.user_name} のアイコンを {icon_url} に更新しました")

            return Response({"message": "アイコンが更新されました。"}, status=status.HTTP_200_OK)

        except firebase_auth.AuthError as e:
            print("認証エラー:", e)
            return Response({"error": f"認証エラー: {str(e)}"}, status=status.HTTP_403_FORBIDDEN)
        except Exception as e:
            print("エラーが発生しました:", e)
            return Response({"error": f"エラーが発生しました: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetUserGroup(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # 現在認証されたユーザーを取得
            user = request.user

            # ユーザーの所属グループを取得
            family_member = user.familymember_set.first()  # 最初の関連するFamilyMemberを取得
            if not family_member:
                return Response({"error": "グループに所属していません。"}, status=status.HTTP_400_BAD_REQUEST)

            group = family_member.group  # ユーザーが所属しているグループ
            references = group.references.all()  # グループに関連する参考画像（見本写真）を取得

            # 見本写真の情報を返す
            reference_data = [{"id": ref.id, "name": ref.reference_name, "image_url": ref.image_url} for ref in references]
            return Response(reference_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)