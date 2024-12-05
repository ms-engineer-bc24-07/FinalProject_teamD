from rest_framework import serializers
from .models import Score

class ScoreSerializer(serializers.ModelSerializer):
  class Meta:
    model = Score
    fields = ['id', 'comparison_image', 'score']  # ちょっとこれでいいのか不安