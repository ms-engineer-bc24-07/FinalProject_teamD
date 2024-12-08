#えなりさん
# from django.shortcuts import render

# Create your views here.先生（新規ユーザーを登録するAPIエンドポイントを作成します。）
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User

class RegisterUserView(APIView):
    def post(self, request):
        uid = request.data.get('uid')
        email = request.data.get('email')
        username = request.data.get('username')

        if not uid or not email or not username:
            return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

        # ユーザーが既に存在するか確認
        if User.objects.filter(uid=uid).exists():
            return Response({"error": "User already exists"}, status=status.HTTP_400_BAD_REQUEST)

        # 新しいユーザーを作成
        user = User.objects.create(uid=uid, email=email, username=username)
        return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)

#ログイン後、バックエンドからユーザー情報を取得してトップページに反映。
class GetUserView(APIView):
    def get(self, request, uid):
        try:
            user = User.objects.get(uid=uid)
            return Response({
                "username": user.username,
                "email": user.email,
            })
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
