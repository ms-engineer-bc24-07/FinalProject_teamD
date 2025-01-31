import cv2
import numpy as np
import urllib.request
from matplotlib import pyplot as plt
from skimage.metrics import structural_similarity as ssim

def load_image_from_url(url):
  # URLから画像をダウンロードしてOpenCV形式に変換する関数
  try:
      # URLから画像をダウンロード
      req = urllib.request.Request(url)
      with urllib.request.urlopen(req) as res:
        body = res.read()
      
      # バイナリデータをNumPy配列に変換
      arr = np.frombuffer(body, dtype=np.uint8)

      # NumPy配列をOpenCV形式にデコード
      img = cv2.imdecode(arr, flags=cv2.IMREAD_COLOR)

      if img is None:
        raise ValueError(f"Failed to decode image from URL: {url}")

      return img
  except Exception as e:
      raise ValueError(f"Error loading image from URL: {url}. Details: {e}")
    
def process_images(reference_image_url, comparison_image_url):
  # S3にアップロードされた画像のURL
  reference_image_url = reference_image_url
  comparison_image_url = comparison_image_url
  print(reference_image_url, flush=True)
  print(comparison_image_url, flush=True )

  # URLから画像をロード
  image1 = load_image_from_url(reference_image_url)
  image2 = load_image_from_url(comparison_image_url)

  # ガウシアンブラーでノイズ除去
  # エッジ検出前に平滑化を行うことで、小さな光の影響を抑えられます。
  image1 = cv2.GaussianBlur(image1, (5, 5), 0)
  image2 = cv2.GaussianBlur(image2, (5, 5), 0)

  # 画像サイズが異なる場合、リサイズ
  if image1.shape != image2.shape:
    image2 = cv2.resize(image2, (image1.shape[1], image1.shape[0]))

  # Cannyエッジ検出で輪郭を取得
  edges1 = cv2.Canny(image1, 100, 200)
  edges2 = cv2.Canny(image2, 100, 200)

  # エッジ画像を拡張（強調表示）
  kernel = np.ones((3, 3), np.uint8)
  edges1 = cv2.dilate(edges1, kernel, iterations=1)
  edges2 = cv2.dilate(edges2, kernel, iterations=1)

  # 輪郭画像を表示
  # plt.figure(figsize=(10, 5))
  # plt.subplot(1, 2, 1), plt.imshow(edges1, cmap='gray'), plt.title("Edges 1")
  # plt.subplot(1, 2, 2), plt.imshow(edges2, cmap='gray'), plt.title("Edges 2")
  # plt.show()

  # 差分を計算
  # difference = cv2.absdiff(edges1, edges2)

  # 差分を二値化
  # _, threshold_diff = cv2.threshold(difference, 30, 255, cv2.THRESH_BINARY)

  # 差分をカラーハイライト（赤色）で表示
  # highlighted = cv2.cvtColor(edges1, cv2.COLOR_GRAY2BGR)
  # highlighted[threshold_diff > 0] = [0, 0, 255]  # 赤でハイライト

  # 結果を表示
  # plt.figure(figsize=(10, 5))
  # plt.subplot(1, 2, 1), plt.imshow(difference, cmap='gray'), plt.title("Difference")
  # plt.subplot(1, 2, 2), plt.imshow(cv2.cvtColor(highlighted, cv2.COLOR_BGR2RGB)), plt.title("Highlighted Differences")
  # plt.show()

  # ピクセル単位の一致率を計算する関数
  def calculate_pixel_similarity(edges1, edges2):
    """
    ピクセル単位の一致率を計算します。
    一致率は、差分がゼロのピクセル数を全ピクセル数で割った値。
    """
    total_pixels = edges1.size  # 全ピクセル数
    non_similar_pixels = np.count_nonzero(cv2.absdiff(edges1, edges2))  # 差分がゼロでないピクセル数
    similar_pixels = total_pixels - non_similar_pixels  # 一致しているピクセル数
    similarity = similar_pixels / total_pixels  # 一致率
    return similarity

  # ピクセル一致率を計算
  pixel_similarity = calculate_pixel_similarity(edges1, edges2)
  # print(f"Pixel Similarity: {pixel_similarity:.2%}", flush=True)

  return pixel_similarity