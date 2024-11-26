from django.db import models

# Create your models here.
from django.db import models
from comparison_images.models import ComparisonImage  # 比較画像との関連

class Score(models.Model):
    comparison_image = models.ForeignKey(ComparisonImage, related_name='scores', on_delete=models.CASCADE)  # 比較画像との関連
    score = models.FloatField()  # スコア（数値）
    evaluated_at = models.DateTimeField(auto_now_add=True)  # 評価日時

    def __str__(self):
        return f"Score for Comparison Image {self.comparison_image.id} - {self.score}"