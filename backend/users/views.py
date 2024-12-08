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
