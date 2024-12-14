# scores/views.py
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from .models import Score
from .serializers import ScoreSerializer

# リスト取得と新規作成のビュー
class ScoreListCreate(generics.ListCreateAPIView):
    queryset = Score.objects.all()
    serializer_class = ScoreSerializer

# スコア詳細取得のためのビュー
class ScoreDetail(generics.RetrieveAPIView):
    queryset = Score.objects.all()
    serializer_class = ScoreSerializer
    lookup_field = 'id'  # URLのパラメータをidとして扱う