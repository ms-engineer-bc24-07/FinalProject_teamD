# comparison_images/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from comparison_images.models import ComparisonImage
from comparison_images.serializers import ComparisonImageSerializer

# 比較画像詳細を取得するためのビュー
class ComparisonImageDetail(APIView):
    def get(self, request, comparison_image_id):
        try:
            comparison_image = ComparisonImage.objects.get(id=comparison_image_id)  # 指定されたIDの比較画像を取得
            serializer = ComparisonImageSerializer(comparison_image)  # シリアライズ
            return Response(serializer.data)
        except ComparisonImage.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

# 比較画像のリストを取得するためのビュー
class ComparisonImageList(APIView):
    def get(self, request):
        comparison_images = ComparisonImage.objects.all()  # すべての比較画像を取得
        serializer = ComparisonImageSerializer(comparison_images, many=True)  # シリアライズ
        return Response(serializer.data)
