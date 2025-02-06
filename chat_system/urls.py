# chat/urls.py
from django.urls import path

from . import views
from .views import UserChattingView

urlpatterns = [
    path("", views.index, name="index"),
    path('<str:room_name>/', views.room, name='room'),
    path('<str:pk>/', UserChattingView.as_view(), name='user_chatting'),
]