from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import FamilyGroup, Invitation
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from django.utils.timezone import now, timedelta
from firebase_admin import auth
import firebase # Firebase初期化コードをインポート

# send_inviteでトークンを検証してからユーザーを認証する
@api_view(['POST'])
def send_invite(request):
    print(f"リクエストヘッダー: {request.headers}")
    # Authorizationヘッダーからトークンを取得
    token = request.headers.get("Authorization", "").split("Bearer ")[-1]
    print(f"受け取ったトークン: {token}")# トークンをログに出力
    
    user = authenticate(request, token=token)  # カスタムバックエンドを使用して認証
    if user is None:
        print("認証に失敗しました")
        return Response({"error": "Authentication failed."}, status=401)

    print(f"認証成功: {user}")

    try:
        email = request.data.get('email')
        group_name = request.data.get('groupName')

        if not email or not group_name:
            return Response({"error": "Email and groupName are required."}, status=400)

        token = get_random_string(length=32)
        expires_at = now() + timedelta(days=7)

        # グループを作成または取得
        group, created = FamilyGroup.objects.get_or_create(name=group_name, owner_id=user.id)

        # 招待を作成
        invitation = Invitation.objects.create(
            group=group,
            email=email,
            token=token,
            expires_at=expires_at
        )

        invite_link = f"http://localhost:3000/invite_accept?token={token}"

        # 招待メールを送信
        send_mail(
            "招待リンク",
            f"以下のリンクから登録を完了してください:\n\n{invite_link}",
            "noreply@example.com",
            [email],
            fail_silently=False,
        )

        return Response({"message": "招待メールを送信しました。"}, status=201)

    except Exception as e:
        return Response({"error": str(e)}, status=500)





@api_view(['POST'])
def accept_invite(request):
    """
    招待リンクのトークンを検証し、招待を受け入れるエンドポイント
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            token = data.get('token')
            user_id = data.get('user_id')  # 登録または既存ユーザーIDを取得

            if not token or not user_id:
                return JsonResponse({"error": "Token and user_id are required."}, status=400)

            # トークンの検証
            invitation = Invitation.objects.filter(token=token).first()
            if not invitation:
                return JsonResponse({"error": "Invalid token."}, status=404)

            # トークンが期限切れか確認
            if invitation.expires_at < now():
                return JsonResponse({"error": "Token has expired."}, status=400)

            # メンバーをグループに追加
            FamilyMember.objects.create(group=invitation.group, user_id=user_id)

            # 招待を更新
            invitation.status = "accepted"
            invitation.save()

            return JsonResponse({"message": "招待を受け入れました。"}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid HTTP method."}, status=405)
