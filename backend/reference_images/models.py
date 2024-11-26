from django.db import models

# Create your models here.
from django.db import models
from users.models import User  # ユーザー関連

class Category(models.Model):
    category_id = models.AutoField(primary_key=True)
    category_name = models.CharField(max_length=100, unique=True)  # カテゴリ名
    user = models.ForeignKey(User, related_name='categories', on_delete=models.CASCADE)  # ユーザー関連
    sample_image_url = models.TextField(null=True, blank=True)  # 見本画像URL
    created_at = models.DateTimeField(auto_now_add=True)  # 登録日時

    def __str__(self):
        return self.category_name

class ReferenceImage(models.Model):
    image_url = models.TextField()  # 見本画像URL
    category = models.ForeignKey(Category, related_name='reference_images', on_delete=models.CASCADE)  # カテゴリとの関連
    uploaded_at = models.DateTimeField(auto_now_add=True)  # アップロード日時

    def __str__(self):
        return f"Reference Image {self.id}"