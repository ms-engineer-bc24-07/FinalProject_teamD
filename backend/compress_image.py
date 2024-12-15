from PIL import Image
import os

def compress_image(image_path, output_path, quality=80):
    """
    画像を圧縮して保存する関数。

    :param image_path: 圧縮する元の画像のパス
    :param output_path: 圧縮後の画像の保存先
    :param quality: 圧縮の品質（1〜100）
    """
    try:
        with Image.open(image_path) as img:
            img.save(output_path, "JPEG", quality=quality)
        print(f"Compressed image saved to {output_path}")
    except Exception as e:
        print(f"An error occurred: {e}")

# 以下は各自のコンテナ内での画像ファイルパスと、圧縮後のファイル名を指定すること。60は圧縮比率で画像によって変更可。
compress_image("/app/IMG_7919.jpeg", "/app/compressed_comparison_image.jpg", quality=60)
