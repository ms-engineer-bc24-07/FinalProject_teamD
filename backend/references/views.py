from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from firebase_admin import auth as firebase_auth
from references.models import Reference
from references.serializers import ReferenceSerializer
from users.models import User  # Userモデルをインポート
from family.models import FamilyMember, FamilyGroup
import boto3

# @csrf_exempt
# def fetch_references(request):
#     """
#     すべての見本写真（Reference）を取得するエンドポイント
#     """
#     if request.method == 'GET':
#         try:
#             # データベースからすべてのReferenceを取得
#             references = Reference.objects.all()
            
#             # 必要なフィールドを選択してJSON形式で返す
#             data = [
#                 {
#                     "id": reference.id,
#                     "reference_name": reference.reference_name,
#                     "image_url": reference.image_url,
#                     "user": reference.user.id,
#                 }
#                 for reference in references
#             ]
#             return JsonResponse(data, safe=False, status=200)
#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=500)
#     else:
#         return JsonResponse({"error": "Invalid HTTP method"}, status=405)

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
        # デバッグ：ユーザーの確認
        if user:
            print(f"User found: {user.user_name}")
        else:
            print(f"User with firebase_uid {firebase_uid} not found.")
        
        if not user:
            return Response(
                {"error": "指定されたFirebase UIDのユーザーが存在しません"},
                status=status.HTTP_404_NOT_FOUND,
            )
        
        # ユーザーが所属するFamilyGroupを取得
        family_group = FamilyMember.objects.filter(user=user).first().group  # 所属グループを取得
        # デバッグ：グループ情報
        if family_group:
            print(f"User's family group: {family_group.name}")
        else:
            print(f"User's family group not found.")    
        if not family_group:
            return Response(
                {"error": "ユーザーが所属しているグループが見つかりません"},
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
            print(f"Uploading image to S3: {object_name}")
            s3.upload_fileobj(image_file, bucket_name, object_name)
            print(f"Image uploaded successfully to S3: {object_name}")
        except Exception as e:
            print(f"Error while uploading to S3: {str(e)}")
            return Response(
                {"error": "S3アップロードに失敗しました", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        # アップロードされた画像のURLを生成
        image_url = f"https://{bucket_name}.s3.{settings.AWS_S3_REGION_NAME}.amazonaws.com/{object_name}"
        print(f"Image URL: {image_url}")

        # Referenceモデルに保存（user_id を設定）
        reference = Reference.objects.create(
            reference_name=reference_name,
            image_url=image_url,
            # user_id=user_id,  # user_id を追加して保存
            user=user,
            familygroup=family_group  # 所属グループを関連付け       
        )
        print(f"Reference created successfully: {reference.id}")
    

        serializer = ReferenceSerializer(reference)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
class GroupReferencesView(APIView):
    def get(self, request):
        try:
            # Firebaseトークンの検証
            auth_header = request.headers.get('Authorization')
            if not auth_header or not auth_header.startswith('Bearer '):
                return Response({"error": "認証トークンが必要です"}, status=status.HTTP_401_UNAUTHORIZED)
            
            token = auth_header.split(' ')[1]
            decoded_token = firebase_auth.verify_id_token(token)
            firebase_uid = decoded_token.get('uid')

            # ユーザーの取得
            user = User.objects.filter(firebase_uid=firebase_uid).first()
            if not user:
                return Response({"error": "ユーザーが見つかりません"}, status=status.HTTP_404_NOT_FOUND)

            # ユーザーが所属するグループを取得
            memberships = FamilyMember.objects.filter(user=user).values_list('group', flat=True)
            owned_groups = FamilyGroup.objects.filter(owner=user).values_list('id', flat=True)

            # 所属グループとオーナーグループのIDを結合
            all_group_ids = list(set(list(memberships) + list(owned_groups)))
            print(f"All Group IDs: {all_group_ids}")  # デバッグ用

            # グループに関連付けられた参照画像を取得
            groups = FamilyGroup.objects.filter(id__in=all_group_ids)
            references = Reference.objects.filter(familygroup__in=groups).distinct()
            print(f"References related to groups: {references}")  # デバッグ用

            serializer = ReferenceSerializer(references, many=True)
            return Response(serializer.data)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)