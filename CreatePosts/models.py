from django.db import models
from django.conf import settings
from django.db.models import CASCADE, ForeignKey


# Create your models here.
class Post(models.Model):
    image_post = models.ImageField(upload_to='uploaded_images/', blank=True)
    content = models.TextField()
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    upload_date = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="liked_posts", blank=True)

    def __str__(self):
        return self.content[:50]

class Comment(models.Model):
    content = models.TextField()
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    upload_date = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='liked_comment', blank=True)
    related_post = ForeignKey(Post, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.content[:50]
