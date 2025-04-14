from django.db import models
from django.conf import settings
from django.db.models import ForeignKey

from account.models import CustomUser


class Message(models.Model):
    objects = models.Manager()
    content = models.TextField()
    send_date = models.DateTimeField(auto_now_add=True)
    message_sender = ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sender')
    message_recipient = ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='recipient')
