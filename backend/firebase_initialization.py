# 1. Firebase Admin SDKのセットアップ。Firebaseトークンを検証するには、Firebase Admin SDKを使用する。firebase_adminの初期化コードを作成。

# import firebase_admin


# # 環境変数で設定された認証情報を使用してFirebase Admin SDKを初期化
# default_app = firebase_admin.initialize_app()

# # 初期化が成功した場合に表示される
# print("Firebase Admin SDK initialized successfully")

import firebase_admin


def initialize_firebase():
    try:
        # Firebase Admin SDKを初期化
        # GOOGLE_APPLICATION_CREDENTIALS 環境変数を使って自動で認証情報を取得
        firebase_admin.initialize_app()

        # 初期化が成功した場合に表示される
        print("Firebase Admin SDK initialized successfully")
    except Exception as e:
        print(f"Error initializing Firebase: {e}")

