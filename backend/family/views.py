from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import FamilyGroup
from django.utils.crypto import get_random_string
from django.utils.timezone import now, timedelta
from firebase_admin import auth

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
