from django.urls import path
from . import views
from .views import PostListView, PostCreateView

urlpatterns = [
    path('', PostListView.as_view(), name='post_list'),
    path('create/', PostCreateView.as_view(), name='post_create'),
]