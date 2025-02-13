
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Q
from django.shortcuts import render, redirect, get_object_or_404
from django.views import View
from django.views.generic import ListView
from channels.auth import login, logout
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken

from GraphConnectSettings.settings import AUTH_USER_MODEL
from .forms import CustomUserCreationForm, CustomAuthenticationForm
from django.contrib.auth import login, authenticate, logout, user_logged_in

from .models import CustomUser


# Create your views here.
def register(request):
    if request.user.is_authenticated:
        return redirect('success')
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST, request.FILES or None)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('success')

    else:
        form = CustomUserCreationForm()
        return render(request, 'account/register.html', {'form':form})



def user_login(request):
    if request.user.is_authenticated:
        return redirect('success')
    if request.method == 'POST':
        form = CustomAuthenticationForm(request, request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                refresh = RefreshToken.for_user(user)  # Create JWT refresh token for the user
                return redirect('success', {'access_token': str(refresh.access_token), 'refresh_token': str(refresh)})
    else:
        form = CustomAuthenticationForm()
    return render(request, 'account/login.html', {'form': form})



def success(request):
    return render(request, 'account/success.html')


def user_logout(request):
    logout(request)

    return redirect('login')


class TokenRefreshView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if not refresh_token:
                return Response({'detail': 'Refresh token is missing'}, status=status.HTTP_400_BAD_REQUEST)

            token = RefreshToken(refresh_token)  # Validate and decode the refresh token
            new_access_token = token.access_token  # Create a new access token
            return Response({'access': str(new_access_token), 'refresh': refresh_token})
        except Exception as e:
            return Response({'detail': 'Invalid or expired refresh token'}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh_token")
            if not refresh_token:
                return Response({'detail': 'Refresh token is required'}, status=status.HTTP_400_BAD_REQUEST)

            token = RefreshToken(refresh_token)
            token.blacklist()  # Blacklist the refresh token
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({'detail': 'Invalid refresh token or error occurred'}, status=status.HTTP_400_BAD_REQUEST)


class users_list(ListView):
    model = CustomUser
    template_name = 'customuser_list.html'
    context_object_name = 'CustomUser'


class UserFollowView(LoginRequiredMixin, View):
    def post(self, request, *args, **kwargs):
        user = get_object_or_404(CustomUser, id=kwargs['pk'])
        if request.user != user:
            if request.user in user.user_follows.all():
                user.user_follows.remove(request.user)
            else:
                user.user_follows.add(request.user)
        return redirect('customuser_list')


class UserSearchView(ListView):
    model = CustomUser
    template_name = 'customuser_list.html'
    context_object_name = 'CustomUser'

    def get_queryset(self):  # new
        query = self.request.GET.get("q")
        object_list = CustomUser.objects.filter(
            Q(name__icontains=query)
        )
        return object_list