from django.db import models
from users.models import User


class FamilyGroup(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="owned_groups")  # 作成者
    #references = models.ManyToManyField(Reference, related_name='groups')  # ManyToMany関係を追加

    def __str__(self):
        return self.name


class FamilyMember(models.Model):
    id = models.AutoField(primary_key=True)
    group = models.ForeignKey(FamilyGroup, on_delete=models.CASCADE, related_name="members")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="family_memberships")
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("group", "user")  # ユーザーとグループの組み合わせを一意に

    def __str__(self):
        return f"{self.user.user_name} in {self.group.name}"

    @classmethod
    def get_group_members(cls, group_id):
        # グループのオーナーを含めた全メンバーを返す
        group = FamilyGroup.objects.get(id=group_id)
        members = cls.objects.filter(group=group).select_related('user')
        
        # オーナーも含めて返す
        all_members = [group.owner] + [member.user for member in members]
        return all_members
    
class Invitation(models.Model):
    id = models.AutoField(primary_key=True)
    group = models.ForeignKey(FamilyGroup, on_delete=models.CASCADE, related_name="invitations")
    token = models.CharField(max_length=32, unique=True)
    invited_user = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)  # 招待されたユーザー
    expires_at = models.DateTimeField()
    status = models.CharField(max_length=20, default="pending", choices=(("pending", "Pending"), ("accepted", "Accepted")))

    def __str__(self):
        return f"Invitation to {self.group.name}"