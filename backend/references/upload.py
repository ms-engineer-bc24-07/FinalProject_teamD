import boto3
def upload_to_s3(file_name, object_name=None):
    """
    ファイルをS3バケットにアップロードする関数
    :param file_name: アップロードするファイル
    :param bucket: アップロード先のS3バケット
    :param object_name: S3オブジェクト名。指定しない場合はfile_nameが使用される
    :return: アップロードが成功すればTrue、失敗すればFalse
    """
    if object_name is None:
        object_name = file_name
    # 直接キーを使用してS3クライアントを作成
    s3_client = boto3.client(
        's3',
        aws_access_key_id='', #実際に取得したアクセスキーを入力する
        aws_secret_access_key='', #実際に取得したアクセスキーを入力する
    )
    bucket= ""
    try:
        s3_client.upload_file(file_name, bucket, object_name)
        print(f"Successfully uploaded {file_name} to {bucket}/{object_name}")
    except Exception as e:
        print(f"S3 Upload Error: {e}")
        return False
    return True
def main():
    if upload_to_s3('sample.txt'):
        print("Upload succeeded.")
    else:
        print("Upload failed.")
if __name__ == "__main__":
    main()