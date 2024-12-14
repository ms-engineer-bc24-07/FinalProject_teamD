# Firebaseのトークンを認識できるようにDjangoに設定するには、Djangoのカスタム認証バックエンドを作成

from firebase_admin import auth as firebase_auth
from django.contrib.auth.models import User
from django.contrib.auth.backends import BaseBackend
from django.core.exceptions import ObjectDoesNotExist

class FirebaseAuthenticationBackend(BaseBackend):
    def authenticate(self, request, token=None):
        """
        Firebase IDトークンを検証してユーザーを認証
        """
        try:
            # トークンをFirebaseで検証
            decoded_token = firebase_auth.verify_id_token(token)
            uid = decoded_token["uid"]
            email = decoded_token["email"]

            # Djangoのユーザーモデルを確認または作成
            user, created = User.objects.get_or_create(username=uid, email=email)

            return user
        except Exception as e:
            print(f"Firebase Authentication failed: {str(e)}")
            return None

    def get_user(self, user_id):
        """
        ユーザーIDからDjangoユーザーを取得
        """
        try:
            return User.objects.get(pk=user_id)
        except ObjectDoesNotExist:
            return None
