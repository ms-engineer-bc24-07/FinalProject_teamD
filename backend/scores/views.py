from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from .models import Score
from .serializers import ScoreSerializer
from .services.image_processing import process_images
import time
from comparison_images.models import ComparisonImage

# リスト取得と新規作成のビュー
class ScoreListCreate(generics.ListCreateAPIView):
	def post(self, request, *args, **kwargs):
		reference_image_url = request.data.get("reference_image_url")
		comparison_img_id = request.data.get("comparison_img_id")
		
		# comparison_img_idでDBの比較画像を検索して比較画像URLを取得
		comparison_image_instance = ComparisonImage.objects.get(id=comparison_img_id)
		comparison_image_url = comparison_image_instance.image_url

		# スコア計算
		result = process_images(reference_image_url, comparison_image_url)

		# データベースにスコアを登録
		score_instance = Score.objects.create(
		  comparison_image=comparison_image_instance,
		  score=result
		)

		serializer = ScoreSerializer(score_instance)
		return Response(serializer.data, status=status.HTTP_201_CREATED)

# スコア詳細取得のためのビュー
class ScoreDetail(generics.RetrieveAPIView):
	queryset = Score.objects.all()
	serializer_class = ScoreSerializer
	lookup_field = 'id'  # URLのパラメータをidとして扱う