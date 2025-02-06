# TideUp Frontend

TideUp は、家族で共有する片付けタスク管理アプリケーションです。家族メンバー間で片付けタスクを共有・管理し、片付けの完了状況を評価することができます。

## 技術スタック

- Next.js
- TypeScript
- Tailwind CSS
- Axios
- Firebase Authentication
- Docker

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
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_API_URL=http://backend:8000
```

3.Docker コンテナの起動

```bash
docker-compose up
```

## プロジェクト構造

```
frontend/
├── src/
│   ├── components/     # 再利用可能なコンポーネント
│   ├── features/       # 機能別のコンポーネントとロジック
│   ├── lib/           # ユーティリティ関数とヘルパー
│   ├── app/           # ページコンポーネント
│   └── types/         # TypeScript型定義
├── public/            # 静的アセット
└── tests/             # テストファイル
```

## 主要機能

### ユーザー管理

- ユーザー登録・編集・削除
- 家族メンバーの管理（一覧表示、招待、削除）
- Firebase Authentication を使用したログイン/ログアウト

### 片付けカテゴリー管理

- カテゴリーの一覧表示
- カテゴリーの登録（名前、見本画像）
- カテゴリーの編集・削除

### 片付け管理

- 片付け記録の一覧表示
- 画像比較による片付け評価スコアの表示

## コーディング規約

- 関数コンポーネントと TypeScript を使用
- スタイリングは Tailwind CSS のユーティリティクラスを使用
- エラー処理は適切に実装し、ユーザーフレンドリーなエラーメッセージを表示
- コンポーネントは可能な限り再利用可能な形で実装
