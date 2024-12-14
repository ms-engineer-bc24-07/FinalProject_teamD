from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import FamilyGroup, Invitation
from django.utils.crypto import get_random_string
from django.utils.timezone import now, timedelta
from firebase_admin import auth

# generate_invite_linkエンドポイント
@api_view(['POST'])
def generate_invite_link(request):
    print(f"リクエストヘッダー: {request.headers}")
    # Authorizationヘッダーからトークンを取得
    token = request.headers.get("Authorization", "").split("Bearer ")[-1]
    print(f"受け取ったトークン: {token}")

    user = authenticate(request, token=token)  # カスタムバックエンドを使用して認証
    if user is None:
        print("認証に失敗しました")
        return Response({"error": "Authentication failed."}, status=401)

    print(f"認証成功: {user}")

    try:
        group_name = request.data.get('groupName')

        if not group_name:
            return Response({"error": "グループ名が必要です。"}, status=400)

        token = get_random_string(length=32)
        expires_at = now() + timedelta(days=7)

        # グループを作成または取得
        group, created = FamilyGroup.objects.get_or_create(name=group_name, owner_id=user.id)

        invite_link = f"http://localhost:3000/invite_accept?token={token}"

        return Response({"inviteLink": invite_link}, status=201)

    except Exception as e:
        return Response({"error": str(e)}, status=500)



#validate_inviteエンドポイントを追加して、トークンの検証を行う処理を実装
@api_view(['POST'])
def validate_invite(request):
    """
    招待トークンを検証するエンドポイント
    """
    try:
        token = request.data.get('token')

        if not token:
            return Response({"error": "トークンが必要です。"}, status=400)

        # トークンが有効かどうか確認
        invitation = Invitation.objects.filter(token=token).first()

        if not invitation:
            return Response({"error": "無効なトークンです。"}, status=404)

        if invitation.expires_at < now():
            return Response({"error": "トークンが期限切れです。"}, status=400)

        return Response({"message": "トークンは有効です。", "groupName": invitation.group.name}, status=200)

    except Exception as e:
        return Response({"error": str(e)}, status=500)