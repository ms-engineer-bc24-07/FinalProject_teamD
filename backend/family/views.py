from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import FamilyGroup, FamilyMember, Invitation
from django.utils.crypto import get_random_string
from django.utils.timezone import now, timedelta
from firebase_admin import auth
from users.models import User

# 招待リンクを検証するエンドポイント
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


# グループ情報取得エンドポイント
@api_view(['GET'])
def get_group_info(request):
    """
    ユーザーが所属しているグループ情報を取得する
    """
    try:
        # Authorization ヘッダーからトークンを取得
        auth_token = request.headers.get("Authorization", "").split("Bearer ")[-1]

        # Firebase トークンを検証し、Firebase UID を取得
        decoded_token = auth.verify_id_token(auth_token)
        firebase_uid = decoded_token["user_id"]

        # Firebase UID を使って Django ユーザーを検索
        user = User.objects.filter(firebase_uid=firebase_uid).first()
        if not user:
            return Response({"error": "ユーザーが存在しません。"}, status=404)

        # ユーザーが所属するグループ情報を取得
        family_member = FamilyMember.objects.filter(user=user).first()
        if not family_member:
            return Response({"groupName": None, "members": []}, status=200)

        # グループとメンバー情報を取得
        group = family_member.group
        members = FamilyMember.objects.filter(group=group).values_list("user__user_name", flat=True)

        # 招待リンクの生成
        token = get_random_string(length=32)
        expires_at = now() + timedelta(days=7)
        invitation = Invitation.objects.create(group=group, token=token, expires_at=expires_at)
        invite_link = f"http://localhost:3000/invite_accept?token={token}"

        
        return Response({
            "groupName": group.name,
            "members": list(members),
            "inviteLink": invite_link, 
        }, status=200)

    except Exception as e:
        return Response({"error": str(e)}, status=401)
