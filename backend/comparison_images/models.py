from django.db import models
from references.models import Reference
from users.models import User

class ComparisonImage(models.Model):
    id = models.AutoField(primary_key=True)  # 主キーはidとして統一
    reference = models.ForeignKey(Reference, related_name='comparison_images', on_delete=models.CASCADE)
    image_url = models.TextField()  # 比較用画像URL
    user = models.ForeignKey(User, related_name='comparison_images', on_delete=models.CASCADE)  # ユーザー関連
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comparison Image for {self.reference.reference_name}"

