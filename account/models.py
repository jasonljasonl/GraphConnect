from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.conf import settings
from cryptography.fernet import Fernet


# Create your models here.
class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Not a valid email address.')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)

        if password:
            user.set_password(password)

        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(username, password, **extra_fields)





# models.py
class CustomUser(AbstractBaseUser, PermissionsMixin):
    encryption_key = models.CharField(max_length=128, blank=True, null=True)
    profile_picture = models.URLField(blank=True, null=True)
    username = models.CharField(unique=True, max_length=50)
    name = models.CharField(max_length=30)
    email = models.EmailField(unique=True)
    user_follows = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="follows", blank=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.username

    def save(self, *args, **kwargs):
        if self.pk is None and self.password:
            pass
        if not self.encryption_key:
            self.encryption_key = Fernet.generate_key().decode()
        super().save(*args, **kwargs)




    @property
    def following(self):
        return self.user_follows.all()

    @property
    def followers(self):
        return CustomUser.objects.filter(user_follows=self)
