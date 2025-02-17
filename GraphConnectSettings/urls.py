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
from CreatePosts.views import check_like_status

router = routers.DefaultRouter()
router.register(r'CreatePosts', views.PostsSerializerView, 'CreatePosts')
router.register(r'account', views.CustomUserSerializerView, 'account')


urlpatterns = [
    path("Home/", include("CreatePosts.urls")),
    path("account/", include("account.urls")),
    path('admin/', admin.site.urls),
    path('chat_system/', include('chat_system.urls')),

    path('api/', include(router.urls)),
    path('api/check-like/<int:post_id>/', check_like_status, name='check_list'),


    path('token/',jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/',jwt_views.TokenRefreshView.as_view(),name='token_refresh')
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
