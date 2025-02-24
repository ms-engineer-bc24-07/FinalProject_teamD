from firebase_admin import auth as firebase_auth
from rest_framework.response import Response
from rest_framework import status
from users.models import User

def verify_firebase_token(request):
    """
    Firebaseトークンを検証し、対応するユーザーを返す
    
    Args:
        request: HTTPリクエストオブジェクト
    
    Returns:
        tuple: (User, error_response)
        - 成功時: (User, None)
        - 失敗時: (None, Response)
    """
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return None, Response(
                {"error": "認証トークンが必要です"}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        token = auth_header.split(' ')[1]
        decoded_token = firebase_auth.verify_id_token(token)
        firebase_uid = decoded_token.get('uid')
        
        user = User.objects.filter(firebase_uid=firebase_uid).first()
        if not user:
            return None, Response(
                {"error": "ユーザーが見つかりません"}, 
                status=status.HTTP_404_NOT_FOUND
            )
            
        return user, None
        
    except firebase_auth.AuthError as e:
        return None, Response(
            {"error": f"認証エラー: {str(e)}"}, 
            status=status.HTTP_403_FORBIDDEN
        )
    except Exception as e:
        return None, Response(
            {"error": str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        ) 