from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from references.models import Reference
from references.serializers import ReferenceSerializer
from users.models import User  # Userモデルをインポート
import boto3


class ReferenceDetail(APIView):
    def get(self, request, reference_id):
        try:
            reference = Reference.objects.get(id=reference_id)
            serializer = ReferenceSerializer(reference)
            return Response(serializer.data)
        except Reference.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)


class ReferenceList(APIView):
    def get(self, request):
        references = Reference.objects.all()
        serializer = ReferenceSerializer(references, many=True)
        return Response(serializer.data)


class ReferenceView(APIView):
    def post(self, request, *args, **kwargs):
        # 必要なデータをリクエストから取得
        image_file = request.FILES.get('image')
        reference_name = request.data.get('referenceName')
        # user_id = request.data.get('user_id')  # user_id を受け取る
        firebase_uid = request.data.get('firebaseUid')

        if not image_file or not reference_name or not firebase_uid:
            return Response(
                {"error": "画像、名前、firebase_uidは必須です"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Firebase UIDを使ってユーザーを検索
        user = User.objects.filter(firebase_uid=firebase_uid).first()
        if not user:
            return Response(
                {"error": "指定されたFirebase UIDのユーザーが存在しません"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # S3にアップロードするための設定
        s3 = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION_NAME
        )

        bucket_name = settings.AWS_STORAGE_BUCKET_NAME
        object_name = f"references/{image_file.name}"

        try:
            # S3にファイルをアップロード
            s3.upload_fileobj(image_file, bucket_name, object_name)
        except Exception as e:
            return Response(
                {"error": "S3アップロードに失敗しました", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        # アップロードされた画像のURLを生成
        image_url = f"https://{bucket_name}.s3.{settings.AWS_S3_REGION_NAME}.amazonaws.com/{object_name}"

        # Referenceモデルに保存（user_id を設定）
        reference = Reference.objects.create(
            reference_name=reference_name,
            image_url=image_url,
            # user_id=user_id,  # user_id を追加して保存
            user=user       
        )

        serializer = ReferenceSerializer(reference)
        return Response(serializer.data, status=status.HTTP_201_CREATED)