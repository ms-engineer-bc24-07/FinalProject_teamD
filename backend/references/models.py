# Reference model
from django.db import models
from users.models import User  # ユーザー関連

class Reference(models.Model):
    id = models.AutoField(primary_key=True)
    reference_name = models.CharField(max_length=100, unique=True)
    image_url = models.TextField()  # 見本画像URL
    user = models.ForeignKey(User, related_name='references', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True) 

    def __str__(self):
        return self.reference_name
