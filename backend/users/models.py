from django.db import models

# Create your models here.
from django.db import models

class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    user_name = models.CharField(max_length=50, unique=True)  # ユーザー名
    email = models.EmailField(max_length=255, unique=True)  # メールアドレス
    password = models.CharField(max_length=255)  # パスワード
    icon_url = models.TextField(null=True, blank=True)  # ユーザーアイコンURL
    created_at = models.DateTimeField(auto_now_add=True)  # 登録日時

    def __str__(self):
        return self.user_name