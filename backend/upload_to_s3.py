import boto3
from botocore.exceptions import NoCredentialsError

def upload_to_s3(file_path, bucket_name, s3_path):
    s3 = boto3.client('s3')

    try:
        with open(file_path, "rb") as file_data:
            s3.upload_fileobj(file_data, bucket_name, s3_path)
        print(f"Upload successful: {s3_path}")
    except FileNotFoundError:
        print("The file was not found")
    except NoCredentialsError:
        print("Credentials not available")

# 以下は各自のコンテナ内でのファイルパスとS3での保存名を指定
upload_to_s3("/app/compressed_comparison_image.jpg", "teamd-finalproject", "images/compressed_comparison_image.jpg")
