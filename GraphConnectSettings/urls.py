from django.contrib import admin
from django.urls import include, path
from django.conf.urls.static import static
from django.conf import settings
from rest_framework import routers
from rest_framework_simplejwt import views as jwt_views

import account
import chat_system
from CreatePosts import views
from CreatePosts.views import (
    check_like_status, CommentCreateAPIView, PostDetailSerializerView, get_comment_count,
    check_comment_like_status, PostCreateAPIView, FollowedPostsListView,
    user_posts_api, delete_post_api, PostRecommendationView
)
from account.views import (
    get_current_user_profile, UserSearchAPIView, update_user_profile, RegisterAPIView,
    FollowedUserListView, FollowUserView, LoginAPIView
)
from chat_system.views import get_chat_users, MessageViewSet
from google_services.google_cloud_storage.google_cloud_storage import upload_file_to_storage
from google_services.google_vision.google_vision import file_used_for_vision

router = routers.DefaultRouter()
router.register(r'postsList', views.PostsSerializerView, 'postsList')
router.register(r'account', account.views.CustomUserSerializerView, 'account')
router.register(r'commentsList', views.CommentsSerializerView, 'commentsList')
router.register(r'chat/messages', MessageViewSet, basename='chat_messages')

urlpatterns = [
    path("Home/", include("CreatePosts.urls")),
    path("api/account/", include("account.urls")),
    path("admin/", admin.site.urls),
    path("chat_system/", include("chat_system.urls")),

    path("api/", include(router.urls)),
    path("api/login/", LoginAPIView.as_view(), name="login"),
    path("api/register/", RegisterAPIView.as_view(), name="register"),

    path("api/check-like/<int:post_id>/", check_like_status, name="check_like"),
    path("api/check-comment_like/<int:comment_id>/", check_comment_like_status, name="check_comment_like"),
    path("api/posts/<int:post_id>/posting_comment/", CommentCreateAPIView.as_view(), name="create_comment"),
    path("api/posts/create_post/", PostCreateAPIView.as_view(), name="create_post"),
    path("api/posts/<int:id>/", PostDetailSerializerView.as_view(), name="post_detail"),
    path("api/posts/<int:post_id>/comment_count/", get_comment_count, name="comment_count"),
    path("api/connected-user/", get_current_user_profile, name="current_user_profile"),
    path("api/posts/followed-posts/", FollowedPostsListView.as_view(), name="followed_posts"),
    path("api/user/followed-users/", FollowedUserListView.as_view(), name="followed_users"),
    path("api/user/<str:username>/follow/", FollowUserView.as_view(), name="follow_user"),
    path("api/search/", UserSearchAPIView.as_view(), name="user_search"),
    path("api/profile/<str:username>/", user_posts_api, name="user_posts_api"),
    path("api/posts/<int:pk>/delete/", delete_post_api, name="post_delete"),
    path("api/account/update/", update_user_profile, name="update_user_profile"),
    path("api/storage_uploads/", upload_file_to_storage, name="storage_uploads"),
    path("api/image_vision/", file_used_for_vision, name="file_for_vision"),
    path("api/recommendations/", PostRecommendationView.as_view(), name="post_recommendations"),
    path("api/chat/users/", get_chat_users, name="chat_users"),

    path("api/token/", jwt_views.TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", jwt_views.TokenRefreshView.as_view(), name="token_refresh"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
