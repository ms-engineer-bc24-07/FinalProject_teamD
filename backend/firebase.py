# 1. Firebase Admin SDKのセットアップ。Firebaseトークンを検証するには、Firebase Admin SDKを使用する。firebase_adminの初期化コードを作成。

import firebase_admin
from firebase_admin import credentials, auth

# Firebaseのサービスアカウントキー（JSONファイル）を設定
cred = credentials.Certificate("/firebase-adminsdk.json")  # 適切なパスに変更
firebase_admin.initialize_app(cred)
