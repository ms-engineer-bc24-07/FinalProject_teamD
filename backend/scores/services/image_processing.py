import os #仮にいれたやつ

import cv2
import numpy as np
from matplotlib import pyplot as plt
from skimage.metrics import structural_similarity as ssim

def process_images():
  ## ---------処理フロー-------------
  ## S3から見本画像と登録画像を取得する
  ## 画像解析
  ## （scoreをDBに登録 →　これはviewで処理する？）
  ## scoreをreturn

  # 画像を読み込む（後でS３からの取得に変える）
  image_path1 = os.path.join(os.getcwd(), "backend/static/images/current.jpg")  # 絶対パスに変換
  image_path2 = os.path.join(os.getcwd(), "backend/static/images/reference.jpg")  # 絶対パスに変換
  
  image1 = cv2.imread(image_path1)
  image2 = cv2.imread(image_path2)

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