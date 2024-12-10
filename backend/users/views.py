from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth.hashers import make_password  # パスワードハッシュ化のため
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import User
from rest_framework import status


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

class UpdateIconAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user  # 現在ログインしているユーザーを取得
        icon_url = request.data.get("icon")  # リクエストボディからアイコンURLを取得

        if icon_url:
            user.icon_url = icon_url  # アイコンURLを更新
            user.save()
            return Response({"message": "アイコンが更新されました"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "アイコンURLが提供されていません"}, status=status.HTTP_400_BAD_REQUEST)