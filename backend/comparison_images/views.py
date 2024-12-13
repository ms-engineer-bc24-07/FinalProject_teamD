# comparison_images/views.py
from rest_framework import generics
from comparison_images.models import ComparisonImage
from comparison_images.serializers import ComparisonImageSerializer

# 比較画像のリストを取得するためのビュー
class ComparisonImageListView(generics.ListAPIView):
    queryset = ComparisonImage.objects.all()
    serializer_class = ComparisonImageSerializer

    def get_queryset(self):
        # `reference`パラメータを取得してフィルタリング
        reference_id = self.request.query_params.get('reference', None)
        if reference_id:
            # reference_idに基づいてフィルタリング
            return ComparisonImage.objects.filter(reference_id=reference_id)
        else:
            return ComparisonImage.objects.all()

# 比較画像の詳細を取得するためのビュー
class ComparisonImageDetailView(generics.RetrieveAPIView):
    queryset = ComparisonImage.objects.all()
    serializer_class = ComparisonImageSerializer

