from django.urls import path
from .views import PostLikeView, CommentLikeView, delete_post_api

urlpatterns = [
    path('<int:pk>/delete/', delete_post_api, name='post_delete'),
    path('<int:pk>/like/', PostLikeView, name='post_like'),
    path('<int:pk>/comment_like/', CommentLikeView, name='comment_like'),

]