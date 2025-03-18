"""
URL configuration for GraphConnectSettings project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include,path
from django.conf.urls.static import static
from django.conf import settings
from rest_framework import routers
from rest_framework_simplejwt import views as jwt_views
from CreatePosts import views
from CreatePosts.views import check_like_status, CommentCreateAPIView, PostDetailSerializerView, get_comment_count, \
    check_comment_like_status, PostCreateAPIView, FollowedPostsListView, MessageViewSet, FollowedUserListView, \
    user_posts_api, delete_post_api
from account.views import get_current_user_profile, UserSearchAPIView, update_user_profile

router = routers.DefaultRouter()
router.register(r'postsList', views.PostsSerializerView, 'postsList')
router.register(r'account', views.CustomUserSerializerView, 'account')
router.register(r'commentsList', views.CommentsSerializerView, 'commentsList')
router.register(r'messagesList', views.MessageViewSet, 'messagesList')
router.register(r'chat/messages', MessageViewSet, basename='chat_messages')


urlpatterns = [
    path("Home/", include("CreatePosts.urls")),
    path("account/", include("account.urls")),
    path('admin/', admin.site.urls),
    path('chat_system/', include('chat_system.urls')),

    path('api/', include(router.urls)),
    path('api/check-like/<int:post_id>/', check_like_status, name='check_list'),
    path('api/check-comment_like/<int:comment_id>/', check_comment_like_status, name='comment_check_list'),
    path('api/posts/<int:post_id>/posting_comment/', CommentCreateAPIView.as_view(), name='create_comment'),
    path('api/posts/create_post/', PostCreateAPIView.as_view(), name='create_post'),
    path('api/posts/<int:id>/', PostDetailSerializerView.as_view(), name='post_detail'),
    path('api/posts/<int:post_id>/comment_count/', get_comment_count, name='comment_count'),
    path('api/connected-user/', get_current_user_profile, name='current_user_profile'),
    path('api/posts/followed-posts/', FollowedPostsListView.as_view(), name='followed_posts'),
    path('api/user/followed-users/', FollowedUserListView.as_view(), name='followed_users'),
    path('api/chat/messages/<int:recipient_id>/', MessageViewSet.as_view({'get': 'list'}),name='messages-by-recipient'),
    path('api/chat/messages/', MessageViewSet.as_view({'post': 'create'}), name='messages-create'),
    path('api/search/', UserSearchAPIView.as_view(), name='user-search'),
    path('api/profile/<str:username>/', user_posts_api, name='user-posts-api'),
    path('api/posts/<int:pk>/delete/', delete_post_api, name='post_delete'),
    path('account/update', update_user_profile, name='update_user_profile'),
    path('api/storage_uploads/', views.upload_file_to_storage, name='storage_uploads'),


    path('token/',jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/',jwt_views.TokenRefreshView.as_view(),name='token_refresh')
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
