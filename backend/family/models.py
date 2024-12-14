from django.db import models
from users.models import User  # ユーザーモデルをインポート

class FamilyGroup(models.Model):
    name = models.CharField(max_length=255)  # グループ名
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="owned_groups")  # 主ユーザー
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class FamilyMember(models.Model):
    group = models.ForeignKey(FamilyGroup, on_delete=models.CASCADE, related_name="members")  # グループ
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="family_memberships")  # ユーザー
    joined_at = models.DateTimeField(auto_now_add=True)

class Invitation(models.Model):
    group = models.ForeignKey(FamilyGroup, on_delete=models.CASCADE, related_name="invitations")  # グループ
    email = models.EmailField()  # 招待先メール
    token = models.CharField(max_length=255, unique=True)  # 招待トークン
    status = models.CharField(max_length=50, default="pending")  # 状態
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()  # 有効期限
