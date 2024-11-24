from datetime import timedelta

from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()


class OTP(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(minutes=10)
        super().save(*args, **kwargs)

    def is_valid(self):
        return not self.is_used and timezone.now() <= self.expires_at

    @property
    def remaining_seconds(self):
        if timezone.now() > self.expires_at:
            return 0
        return int((self.expires_at - timezone.now()).total_seconds())

    def refresh(self, new_code):
        self.code = new_code
        self.expires_at = timezone.now() + timedelta(minutes=10)
        self.is_used = False
        self.save()
