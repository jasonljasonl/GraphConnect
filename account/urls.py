from django.urls import path

from . import views
from .views import update_user_profile, FollowUserView, upload_profile_picture

urlpatterns = [
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('<str:username>/follow/', FollowUserView, name='follow_user'),
    path('update/', update_user_profile, name='update_user_profile'),
    path("upload-profile-picture/", upload_profile_picture, name="upload-profile-picture"),

]