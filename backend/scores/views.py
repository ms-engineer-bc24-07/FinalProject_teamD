from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Score
from .serializers import ScoreSerializer
from .services.image_processing import process_images

class ScoreView(APIView):
  def post(self, request, *args, **kwargs):

    # # リクエストデータから比較画像のIDを取得
    # comparison_image_id = request.data.get("comparison_image_id")
    # if not comparison_image_id:
    #   return Response({"error": "comparison_image_id is required."}, status=status.HTTP_400_BAD_REQUEST)

    # try:
    #   # ComparisonImage を取得
    #   comparison_image = ComparisonImage.objects.get(id=comparison_image_id)
    # except ComparisonImage.DoesNotExist:
    #   return Response({"error": "ComparisonImage not found."}, status=status.HTTP_404_NOT_FOUND)

    # スコア計算
    result = process_images()
    print(result, flush=True)
  
    # # データベースにスコアを登録
    # score_instance = Score.objects.create(
    #   comparison_image=comparison_image,
    #   score=score_value
    # )

    # # 登録したデータをシリアライズしてレスポンスとして返す
    # serializer = ScoreSerializer(score_instance)
    # return Response(serializer.data, status=status.HTTP_201_CREATED)

    # 一旦仮のレスポンス↓↓↓
    score = Score.objects.all()
    serializer = ScoreSerializer(score, many=True)
    return Response(serializer.data)