from django.urls import reverse
from django.test import SimpleTestCase

class UsersUrlsTest(SimpleTestCase):
    
    def test_register_user_url(self):
        # URLが正しく解決されるかテスト
        url = reverse('register_user')  # 名前付きURLでURLを解決
        self.assertEqual(url, '/api/users/register/')  # 期待されるURLと比較

    def test_get_user_url(self):
        url = reverse('get_user')
        self.assertEqual(url, '/api/users/get_user/')

    def test_accept_invite_url(self):
        url = reverse('accept_invite')
        self.assertEqual(url, '/api/users/accept_invite/')

    def test_update_icon_url(self):
        url = reverse('update_icon')
        self.assertEqual(url, '/api/users/update_icon/')
