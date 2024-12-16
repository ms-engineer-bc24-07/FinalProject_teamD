# Score model
from django.db import models
from comparison_images.models import ComparisonImage  # 比較画像との関連

class Score(models.Model):
    comparison_image = models.ForeignKey(ComparisonImage, on_delete=models.CASCADE)  # ComparisonImageと関連付け
    score = models.DecimalField(max_digits=5, decimal_places=2)  # 小数を扱うためにDecimalFieldに変更
    created_at = models.DateTimeField(auto_now_add=True)  # スコア登録日時

    def __str__(self):
        return f"Score for {self.comparison_image.id} - {self.score}"
