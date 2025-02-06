from django.db import models
from django.conf import settings
from django.db.models import ForeignKey


class Message(models.Model):
    objects = models.Manager()
    content = models.TextField()
    send_date = models.DateTimeField(auto_now_add=True)


class User_message(models.Model):
    objects = models.Manager()
    sending_from_to = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="from_to", blank=True)
    related_message = ForeignKey(Message, on_delete=models.CASCADE, null=True)
