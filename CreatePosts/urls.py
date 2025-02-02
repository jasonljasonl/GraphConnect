from django.urls import path
from .views import PostListView, PostCreateView, PostUpdateView, PostDeleteView, PostLikeView, CommentCreateView, \
    ViewPostView, CommentsListView, CommentLikeView, CommentDeleteView, CommentUpdateView

urlpatterns = [
    path('', PostListView.as_view(), name='post_list'),
    path('create/', PostCreateView.as_view(), name='post_create'),
    path('<int:pk>/update/', PostUpdateView.as_view(), name='post_update'),
    path('<int:pk>/delete/', PostDeleteView.as_view(), name='post_delete'),
    path('<int:pk>/like/', PostLikeView.as_view(), name='post_like'),
    path('<int:pk>/view/', ViewPostView.as_view(), name='view_post'),
    path('<int:pk>/create_comment/', CommentCreateView.as_view(), name='post_comment'),
    path('<int:pk>/comments/', CommentsListView.as_view(), name='comments_list'),
    path('<int:pk>/comment_like/', CommentLikeView.as_view(), name='comment_like'),
    path('<int:pk>/update_comment/', CommentUpdateView.as_view(), name='comment_update'),
    path('<int:pk>/delete_comment/', CommentDeleteView.as_view(), name='comment_delete'),
]