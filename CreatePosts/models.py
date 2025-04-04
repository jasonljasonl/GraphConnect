from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.conf import settings
from django.db.models import CASCADE, ForeignKey
from django.http import JsonResponse


# Create your models here.
class Post(models.Model):
    objects = models.Manager()

    image_post = models.URLField(max_length=500, null=True, blank=True)
    content = models.TextField()
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    upload_date = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="liked_posts", blank=True)
    labels = ArrayField(models.CharField(max_length=255), default=list)

    def __str__(self):
        return self.content[:50]

    def comment_count(self):
        return self.comment_set.count()

    def like_count(self):
        return self.likes.count()




class Comment(models.Model):
    objects = models.Manager()

    image_comment = models.ImageField(upload_to='comments/', blank=True)
    content = models.TextField()
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    upload_date = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='liked_comment', blank=True)
    related_post = ForeignKey(Post, on_delete=models.CASCADE, null=True, related_name="comments")

    def __str__(self):
        return self.content[:50]

    def like_count(self):
        return self.likes.count()
