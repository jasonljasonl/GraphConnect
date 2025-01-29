from django.db import models
from django.conf import settings

from GraphConnectSettings.settings import MEDIA_ROOT

def user_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    return "user_{0}/{1}".format(instance.CustomUser.id, filename)

# Create your models here.
class Post(models.Model):
    image_post = models.ImageField(upload_to='uploaded_images/', blank=True)
    content = models.TextField()
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    upload_date = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="liked_posts", blank=True)


    def __str__(self):
        return self.content[:50]
