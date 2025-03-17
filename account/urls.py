from django.urls import path

from CreatePosts.views import FollowUserView
from . import views
from .views import users_list, update_user_profile

urlpatterns = [
    path("register/", views.register, name="register"),
    path("login/", views.user_login, name="login"),
    path('logout/', views.LogoutView.as_view(), name='logout'),

    path("success/", views.success, name="success"),
    path("customusers_list/", users_list.as_view(), name="customuser_list"),
    path('<str:username>/follow/', FollowUserView, name='follow_user'),
    path('update/', update_user_profile, name='update_user_profile'),

]