# 使用するベースイメージ（Python 3.9）
FROM python:3.9-slim

# Docker環境でのOpenCVのインストールエラーの解消　(https://qiita.com/narista/items/a3d7d26ae50d54c2553a)
RUN apt-get update && apt-get install -y libopencv-dev 

# 作業ディレクトリを設定
WORKDIR /app

# 必要なパッケージをインストール
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# プロジェクトファイルをコピー
COPY . /app

# データベースマイグレーションを実行
# RUN python manage.py migrate

# ポート8000を開放
EXPOSE 8000

# Django開発サーバーを起動
# CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
