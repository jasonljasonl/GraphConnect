from django.urls import path

from . import views

urlpatterns = [
    path("", views.creatingPost, name="index"),
]