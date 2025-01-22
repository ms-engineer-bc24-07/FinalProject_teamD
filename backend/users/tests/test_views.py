from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from users.models import User
import firebase_admin
from firebase_admin import auth
from django.contrib.auth import get_user_model


def get_firebase_token(firebase_uid):
    # テスト用にユーザーIDでカスタムトークンを生成
    return auth.create_custom_token(firebase_uid)


class UserViewsTestCase(TestCase):
    
    def setUp(self):
        # テスト用のユーザーを作成
        self.user = User.objects.create(
            user_name="testuser",  # 'username'ではなく'user_name'
            email="testuser@example.com",
            password="password123",
            firebase_uid="some-firebase-uid",  # firebase_uidを指定
        )
        
        # カスタムトークンを生成
        self.token = get_firebase_token(self.user.firebase_uid)

        self.client = APIClient()

    def test_register_user(self):
        """
        新規ユーザー登録のテスト
        """
        url = "/api/users/register/"
        data = {
            "user_name": "newuser",
            "email": "newuser@example.com",
            "password": "newpassword",
            "firebase_uid": "some-firebase-uid",
            "group_name": "testgroup"
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("inviteLink", response.data)

    def test_get_user(self):
        """
        ログインユーザー情報を取得するテスト
        """
        url = "/api/users/get_user/"
        
        # ここではセットアップ時に生成したトークンを使用
        headers = {"Authorization": f"Bearer {self.token}"}
        
        response = self.client.post(url, {"email": self.user.email}, headers=headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["user_name"], self.user.user_name)

    def test_accept_invite(self):
        """
        招待を受けたユーザーがグループに参加するテスト
        """
        url = "/api/users/accept_invite/"
        data = {
            "token": "valid-token",  # 正しいトークンに置き換える
            "user_name": "inviteduser",
            "email": "inviteduser@example.com",
            "password": "password123",
            "firebase_uid": "firebase-uid-invite"
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("message", response.data)
    
    def test_update_icon(self):
        """
        ユーザーアイコンの更新テスト
        """
        url = "/api/users/update_icon/"
        
        # カスタムトークンを使用して認証ヘッダーを作成
        headers = {"Authorization": f"Bearer {self.token}"}
        data = {"icon": "new-icon-url"}
        
        response = self.client.post(url, data, headers=headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "アイコンが更新されました。")
