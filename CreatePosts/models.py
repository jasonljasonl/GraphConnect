from django.db import models
from django.conf import settings
from django.db.models import CASCADE, ForeignKey
from django.http import JsonResponse


# Create your models here.
class Post(models.Model):
    objects = models.Manager()  # ✅ Corrected model manager

    image_post = models.ImageField(upload_to='uploaded_images/', blank=True)
    content = models.TextField()
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    upload_date = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="liked_posts", blank=True)

    def __str__(self):
        return self.content[:50]

    def comment_count(self):  # ✅ Returns the number of comments on a post
        return self.comment_set.count()

    def like_count(self):  # ✅ Returns the number of likes on a post
        return self.likes.count()




class Comment(models.Model):
    objects = models.Manager()  # ✅ Corrected model manager

    image_comment = models.ImageField(upload_to='uploaded_images/', blank=True)
    content = models.TextField()
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    upload_date = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='liked_comment', blank=True)
    related_post = ForeignKey(Post, on_delete=models.CASCADE, null=True, related_name="comments")  # ✅ Added related_name

    def __str__(self):
        return self.content[:50]

    def like_count(self):  # ✅ Returns the number of likes on a comment
        return self.likes.count()
