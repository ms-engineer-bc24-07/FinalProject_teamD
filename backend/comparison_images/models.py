from django.db import models

# Create your models here.
from django.db import models
from reference_images.models import ReferenceImage  # 見本画像との関連

class ComparisonImage(models.Model):
    reference_image = models.ForeignKey(ReferenceImage, related_name='comparison_images', on_delete=models.CASCADE)  # 見本画像との関連
    image_url = models.TextField()  # 比較用画像URL
    uploaded_at = models.DateTimeField(auto_now_add=True)  # アップロード日時

    def __str__(self):
        return f"Comparison Image {self.id}"