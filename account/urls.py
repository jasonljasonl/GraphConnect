from django.urls import path

from . import views
from .views import users_list, UserFollowView

urlpatterns = [
    path("register/", views.register, name="register"),
    path("login/", views.user_login, name="login"),
    path('logout/', views.user_logout, name='logout'),
    path("success/", views.success, name="success"),
    path("customusers_list/", users_list.as_view(), name="customuser_list"),
    path('<int:pk>/follows/', UserFollowView.as_view(), name='customuser_follows'),

]