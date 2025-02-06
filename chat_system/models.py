from django.db import models
from django.conf import settings


class Messages(models.Model):
    objects = models.Manager()
    content = models.TextField()
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="messages", on_delete=models.CASCADE)
    send_date = models.DateTimeField(auto_now_add=True)
