import boto3
from django.conf import settings

def upload_to_s3(image_file, folder_name):
    """
    S3に画像をアップロードし、URLを返す
    
    Args:
        image_file: アップロードする画像ファイル
        folder_name: 保存先フォルダ名（例：'references' または 'comparison_images'）
    
    Returns:
        str: アップロードされた画像のURL
    
    Raises:
        Exception: S3アップロード時のエラー
    """
    s3 = boto3.client(
        's3',
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_S3_REGION_NAME
    )

    bucket_name = settings.AWS_STORAGE_BUCKET_NAME
    object_name = f"{folder_name}/{image_file.name}"

    s3.upload_fileobj(image_file, bucket_name, object_name)
    
    return f"https://{bucket_name}.s3.{settings.AWS_S3_REGION_NAME}.amazonaws.com/{object_name}" 