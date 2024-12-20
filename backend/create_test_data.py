from users.models import User
from references.models import Reference
from comparison_images.models import ComparisonImage
from scores.models import Score

def create_test_data():
    # ユーザーAの作成
    user_a = User.objects.create(user_name='User A', email='usera@example.com')

    # 見本画像のURL（S3にアップロード済みの画像URL）
    reference_image_url = 'https://teamd-finalproject.s3.ap-northeast-1.amazonaws.com/images/output_image.jpeg'

    # Referenceを作成
    reference = Reference.objects.create(
        user=user_a, 
        image_url=reference_image_url  # S3のURLを保存
    )

    # ユーザーBの作成
    user_b = User.objects.create(user_name='User B', email='userb@example.com')

    # 比較画像のURL（S3にアップロード済みの画像URL）
    comparison_image_url = 'https://teamd-finalproject.s3.ap-northeast-1.amazonaws.com/images/compressed_comparison_image.jpg'

    # ComparisonImageを作成
    comparison_image = ComparisonImage.objects.create(
        reference=reference, 
        user=user_b, 
        image_url=comparison_image_url  # S3のURLを保存
    )

    # スコアの計算（仮のスコア）
    score = 85.0  # 例：画像比較でのスコア

    # スコアを保存
    Score.objects.create(
        comparison_image=comparison_image, 
        score=score
    )


create_test_data()
