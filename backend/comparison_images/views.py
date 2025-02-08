# comparison_images/views.py
from users.models import User
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from comparison_images.models import ComparisonImage
from comparison_images.serializers import ComparisonImageSerializer
from utils.s3_utils import upload_to_s3
from references.models import Reference

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

# 比較画像をS3にアップしてDBに登録
class ComparisonImageCreateView(APIView):
    def post(self, request, *args, **kwargs):
        image_file = request.FILES.get('image')
        firebase_uid = request.data.get('firebaseUid')
        reference_id = request.data.get('referenceId')

        if not image_file or not firebase_uid or not reference_id:
            return Response(
                {"error": "画像、見本画像ID、firebase_uidは必須です"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Firebase UIDを使ってユーザーを検索
        user = User.objects.filter(firebase_uid=firebase_uid).first()
        if not user:
            return Response(
                {"error": "指定されたFirebase UIDのユーザーが存在しません"},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            # S3にアップロードして画像URLを取得
            image_url = upload_to_s3(image_file, 'comparison_images')
        except Exception as e:
            return Response(
                {"error": "S3アップロードに失敗しました", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        # reference_idでDBの見本画像を検索
        reference_instance = Reference.objects.get(id=reference_id)

        # DBに比較画像を登録
        comparison_img_instance = ComparisonImage.objects.create(
            image_url=image_url,
            reference=reference_instance,
            user=user       
        )

        serializer = ComparisonImageSerializer(comparison_img_instance)
        return Response(serializer.data, status=status.HTTP_201_CREATED)