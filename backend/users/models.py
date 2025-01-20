# User model

from django.db import models

class User(models.Model):
    id = models.AutoField(primary_key=True)
    firebase_uid = models.CharField(max_length=50, unique=True, null=True, blank=True)  # Firebase UID
    user_name = models.CharField(max_length=50, unique=True)
    email = models.EmailField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    icon_url = models.URLField(default="/icons/icon-1.png", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user_name
    