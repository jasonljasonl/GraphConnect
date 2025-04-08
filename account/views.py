import uuid

from django.conf import settings
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Q
from django.http import JsonResponse
from django.shortcuts import redirect, get_object_or_404
from django.views import View
from channels.auth import login, logout
from google.cloud import storage
from rest_framework import status, viewsets, generics
from rest_framework.decorators import permission_classes, api_view, authentication_classes
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
import requests

from GraphConnectSettings.serializer import CustomUserSerializer
from django.contrib.auth import login, authenticate, logout

from .models import CustomUser


# Create your views here.
class CustomUserSerializerView(viewsets.ModelViewSet):
    serializer_class = CustomUserSerializer
    queryset = CustomUser.objects.all()


class RegisterAPIView(APIView):
    def post(self, request):
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            return Response(
                {
                    "message": "Account successfully created",
                    "user": serializer.data,
                    "access_token": access_token,
                    "refresh_token": str(refresh)
                },
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginAPIView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(request, username=username, password=password)
        if user is not None:
            if not user.is_active:
                return Response({"error": "Ce compte est désactivé"}, status=status.HTTP_403_FORBIDDEN)

            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            return Response(
                {
                    "message": "Connexion réussie",
                    "access_token": access_token,
                    "refresh_token": str(refresh)
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"error": "Identifiants invalides"},
                status=status.HTTP_400_BAD_REQUEST,
            )




def user_logout(request):
    logout(request)

    return redirect('login')


class TokenRefreshView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if not refresh_token:
                return Response({'detail': 'Refresh token is missing'}, status=status.HTTP_400_BAD_REQUEST)

            token = RefreshToken(refresh_token)
            new_access_token = token.access_token
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
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({'detail': 'Invalid refresh token or error occurred'}, status=status.HTTP_400_BAD_REQUEST)



class UserFollowView(LoginRequiredMixin, View):
    def post(self, request, *args, **kwargs):
        user = get_object_or_404(CustomUser, id=kwargs['pk'])
        if request.user != user:
            if request.user in user.user_follows.all():
                user.user_follows.remove(request.user)
            else:
                user.user_follows.add(request.user)
        return redirect('customuser_list')



class UserSearchAPIView(APIView):
    def get(self, request):
        query = request.GET.get("q", "")
        if query:
            users = CustomUser.objects.filter(Q(name__icontains=query))
            serializer = CustomUserSerializer(users, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"message": "No query provided"}, status=status.HTTP_400_BAD_REQUEST)



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_current_user_profile(request):
    user = request.user
    serializer = CustomUserSerializer(user)
    return Response(serializer.data)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    user = request.user
    serializer = CustomUserSerializer(user, data=request.data, partial=True)

    if serializer.is_valid():
        if 'profile_picture' in request.FILES:
            user.profile_picture = request.FILES['profile_picture']

        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def FollowUserView(request, username):
    try:
        user = get_object_or_404(CustomUser, username=username)

        if request.user in user.user_follows.all():
            user.user_follows.remove(request.user)
        else:
            user.user_follows.add(request.user)
        return JsonResponse({'message': 'User followed'})
    except CustomUser.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)



class FollowedUserListView(generics.ListAPIView):
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        user = self.request.user
        followed_users_ids = user.follows.values_list("id", flat=True)
        return CustomUser.objects.filter(Q(id__in=followed_users_ids) | Q(id=user.id))



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def upload_profile_picture(request):
    file = request.FILES.get("file")

    if not file:
        return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        client = storage.Client()
        bucket = client.bucket(settings.GS_BUCKET_NAME)
        blob_name = f"profile_picture/{uuid.uuid4()}_{file.name}"
        blob = bucket.blob(blob_name)

        blob.upload_from_file(file, content_type=file.content_type)

        return Response({"url": blob.public_url}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
