# chat/urls.py
from django.urls import path

from .views import UserChattingView

urlpatterns = [
    path('<str:pk>/', UserChattingView.as_view(), name='user_chatting'),


]