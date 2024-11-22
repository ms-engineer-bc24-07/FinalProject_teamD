# 使用するベースイメージ（Python 3.9）
FROM python:3.9-slim

# 作業ディレクトリを設定
WORKDIR /app

# 必要なパッケージをインストール
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# プロジェクトファイルをコピー
COPY . /app

# データベースマイグレーションを実行
RUN python manage.py migrate

# ポート8000を開放
EXPOSE 8000

# Django開発サーバーを起動
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
