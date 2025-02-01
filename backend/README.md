# TideUp Backend

TideUp アプリケーションのバックエンド API サーバーです。Django REST Framework を使用し、Firebase 認証と連携したユーザー管理、画像比較機能、家族グループ管理機能を提供します。

## 技術スタック

- Python 3.9
- Django / Django REST Framework
- PostgreSQL
- OpenCV
- AWS S3
- Firebase Authentication
- Docker

## アプリケーション構成

### Django アプリケーション

- **users**: ユーザー管理

  - ユーザー登録・認証
  - グループ作成
  - 招待リンクによる新規ユーザー登録
  - ユーザーアイコン管理

- **family**: 家族グループ管理

  - ユーザーの所属グループ情報管理
  - 招待リンクの検証

- **references**: 見本写真管理

  - 見本写真の登録・記録
  - 写真リストの取得・参照

- **comparison-images**: 比較用画像管理

  - 比較用画像の登録
  - 画像の参照・取得

- **scores**: 画像比較スコア管理
  - 画像比較結果のスコア記録
  - スコア履歴管理

## セットアップ手順

### Docker 環境での実行

1. リポジトリのクローン

```bash
git clone [repository-url]
cd [repository-name]
```

2.環境変数の設定

```env
# .envファイルを作成
DATABASE_URL=postgresql://postgres:password@db:5432/mydatabase
GOOGLE_APPLICATION_CREDENTIALS=/app/firebase-adminsdk.json
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_STORAGE_BUCKET_NAME=your-bucket-name
AWS_S3_REGION_NAME=your-region
AWS_S3_SIGNATURE_VERSION=s3v4
```

3.Firebase Admin SDK の設定

- Firebase Admin SDK の JSON ファイルを firebase-adminsdk.json として配置

  4.Docker コンテナの起動

```bash
docker-compose up
```

## API エンドポイント

### Users

- POST /api/users/register/: ユーザー登録
- GET /api/users/get_user/: ログイン中ユーザー情報取得
- PUT /api/users/update_icon/: ユーザーアイコン更新
- POST /api/users/accept_invite/: 招待リンク経由のユーザー登録

### Family

- GET /api/family/get_group_info/: 所属グループ情報取得
- POST /api/family/validate_invite/: 招待リンク検証

### References

- POST /api/references/upload/: 見本写真登録
- GET /api/references/: 見本写真リスト取得
- GET /api/references/<int:reference_id>/: 特定の見本写真取得
- GET /api/references/group-references/:所属グループの見本写真取得

### Comparison Images

- POST /api/comparison-images/upload/: 比較用画像登録
- GET /api/comparison-images/<int:pk>/: 比較用画像取得
- GET i/ap/comparison-images/:比較画像リスト取得

### Scores

POST /api/scores/: スコア登録
GET /api/scores/<int:id>/: スコア履歴取得

## データベース設定

PostgreSQL データベースは Docker Compose で自動的にセットアップされます：

```yaml
db:
  image: postgres:13
  environment:
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: password
    POSTGRES_DB: mydatabase
```

## S3 設定

1.AWS アカウントで以下を準備：

- S3 バケット作成
- IAM ユーザー作成（S3 アクセス権限付与）
- アクセスキーとシークレットキーの取得

  2.必要な環境変数の設定：

- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- AWS_STORAGE_BUCKET_NAME
- AWS_S3_REGION_NAME
