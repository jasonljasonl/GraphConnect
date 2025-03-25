from datetime import datetime

from django.contrib.auth.decorators import login_required
from django.contrib.auth.hashers import make_password
from django.db.models import Q
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render, get_list_or_404
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.shortcuts import redirect
from django.views import View
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.reverse import reverse_lazy
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from google.cloud import storage, vision

from chat_system.models import Message
from meta_services.faiss.faiss_recommandations_system import queryset
from .models import Comment
from django.views.generic import ListView, CreateView, UpdateView, DeleteView, DetailView

from rest_framework import viewsets, serializers, generics, permissions, status

from CreatePosts.models import Post
from account.models import CustomUser
from cryptography.fernet import Fernet


class PostCreateView(LoginRequiredMixin, CreateView):
    model = Post
    fields = ['content','image_post']
    template_name = 'create_post.html'
    success_url = reverse_lazy('post_list')

    def form_valid(self, form):
        form.instance.author = self.request.user
        return super().form_valid(form)


class PostUpdateView(LoginRequiredMixin,UserPassesTestMixin,UpdateView):
        model = Post
        fields = ['content', 'image_post']
        template_name = 'create_post.html'
        success_url = reverse_lazy('post_list')

        def test_func(self, **kwargs):
            post = self.get_object()
            return self.request.user == post.author


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def delete_post_api(request, pk):
    post = get_object_or_404(Post, pk=pk)

    if request.user != post.author:
        return Response({'error': 'You do not have permission to delete this post'}, status=status.HTTP_403_FORBIDDEN)

    post.delete()
    return Response({'message': 'Post deleted successfully'}, status=status.HTTP_204_NO_CONTENT)




class PostListView(ListView):
    model = Post
    template_name = 'post_list.html'
    context_object_name = 'posts'


class ViewPostView(DetailView):
        model = Post
        template_name = 'view_post.html'
        context_object_name = 'selected_post'

        def get(self, request, pk):
            selected_post = get_object_or_404(Post, id=pk)
            return render(request, 'view_post.html', {'selected_post': selected_post})


class CommentCreateView(LoginRequiredMixin, CreateView):
    model = Comment
    fields = ['image_comment','content']
    template_name = 'create_comment.html'
    success_url = reverse_lazy('post_list')

    def form_valid(self, form):
        form.instance.author = self.request.user
        post = get_object_or_404(Post, pk=self.kwargs.get('pk'))
        form.instance.related_post = post

        return super().form_valid(form)


class CommentsListView(ListView):
    model = Comment
    template_name = 'view_comment.html'
    context_object_name = 'comments'

    def get(self, request, pk):
        selected_post = get_object_or_404(Post, pk=self.kwargs.get('pk'))
        comment_list = get_list_or_404(Comment)
        return render(request, 'view_comment.html', {'selected_post': selected_post, 'comments':comment_list})




class CommentUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = Comment
    fields = ['image_comment','content']
    template_name = 'create_comment.html'
    success_url = reverse_lazy('post_list')

    def test_func(self, **kwargs):
        comment = self.get_object()
        return self.request.user == comment.author


class CommentDeleteView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    model = Comment
    template_name = 'post_confirm_delete.html'
    success_url = reverse_lazy('post_list')

    def test_func(self, **kwargs):
        comment = self.get_object()
        return self.request.user == comment.author



def get_comment_count(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
        comment_count = post.comments.count()
        return JsonResponse({"count": comment_count})
    except Post.DoesNotExist:
        return JsonResponse({"error": "Post not found"}, status=404)

class CommentLikeView(LoginRequiredMixin, View):
    def post(self, request, *args, **kwargs):
        comment = get_object_or_404(Comment, id=kwargs['pk'])
        if request.user in comment.likes.all():
            comment.likes.remove(request.user)
        else:
            comment.likes.add(request.user)
        return redirect('post_list')


@api_view(['POST'])
@permission_classes([IsAuthenticated])  # Only authenticated users can like a post
@authentication_classes([JWTAuthentication])  # Add JWT authentication
def CommentLikeView(request,pk):
    try:
        comment = Comment.objects.get(id=pk)
        if request.user in comment.likes.all():
            comment.likes.remove(request.user)
        else:
            comment.likes.add(request.user)
        comment.save()
        return JsonResponse({'message': 'Comment liked successfully'})
    except Comment.DoesNotExist:
        return JsonResponse({'error': 'Comment not found'}, status=404)


@api_view(['POST'])
@permission_classes([IsAuthenticated])  # Only authenticated users can like a post
@authentication_classes([JWTAuthentication])  # Add JWT authentication
def PostLikeView(request, pk):  # Use 'pk' here
    try:
        post = Post.objects.get(id=pk)

        if request.user in post.likes.all():
            post.likes.remove(request.user)
        else:
            post.likes.add(request.user)
        post.save()

        return JsonResponse({'message': 'Post liked successfully'})
    except Post.DoesNotExist:
        # Return an error response if the post is not found
        return JsonResponse({'error': 'Post not found'}, status=404)




@api_view(['POST'])
@permission_classes([IsAuthenticated])  # Only authenticated users can like a post
@authentication_classes([JWTAuthentication])  # Add JWT authentication
def FollowUserView(request, username):  # Use 'pk' here
    try:
        user = get_object_or_404(CustomUser, username=username)

        if request.user in user.user_follows.all():
            user.user_follows.remove(request.user)
        else:
            user.user_follows.add(request.user)
        return JsonResponse({'message': 'User followed'})
    except CustomUser.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def check_like_status(request, post_id):
    try:
        print("Logged in user :", request.user)

        post = get_object_or_404(Post, id=post_id)
        user = request.user

        has_liked = post.likes.filter(id=user.id).exists()

        return Response({'liked': has_liked})

    except Exception as e:
        print("Error", str(e))
        return Response({'error': str(e)}, status=500)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def check_comment_like_status(request, comment_id):
    try:
        print("Logged in user :", request.user)

        comment = get_object_or_404(Comment, id=comment_id)
        user = request.user

        has_liked = comment.likes.filter(id=user.id).exists()

        return Response({'liked': has_liked})

    except Exception as e:
        print("Error", str(e))
        return Response({'error': str(e)}, status=500)


class CommentCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id, *args, **kwargs):
        post = get_object_or_404(Post, pk=post_id)
        serializers = CommentSerializer(data=request.data)
        if serializers.is_valid():
            serializers.save(author=request.user, related_post=post)
            return Response(serializers.data)
        return Response(serializers.errors)




class PostCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)



class CustomUserSerializer(serializers.ModelSerializer):
    following = serializers.PrimaryKeyRelatedField(
        many=True,
        read_only=True,
        source="user_follows"
    )


    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password', 'name', 'profile_picture', 'following']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        return user


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.id')

    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ['author', 'created_at']


class PostsSerializerView(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    queryset = Post.objects.all()


class FollowedPostsListView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        user = self.request.user
        return Post.objects.filter(Q(author__in=user.follows.all()) | Q(author=user))



class FollowedUserListView(generics.ListAPIView):
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        user = self.request.user
        followed_users_ids = user.follows.values_list("id", flat=True)
        return CustomUser.objects.filter(Q(id__in=followed_users_ids) | Q(id=user.id))




class CustomUserSerializerView(viewsets.ModelViewSet):
    serializer_class = CustomUserSerializer
    queryset = CustomUser.objects.all()

class CommentsSerializerView(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()


class PostDetailSerializerView(generics.RetrieveAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    lookup_field = 'id'

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'message_sender', 'message_recipient', 'content', 'send_date']





import logging

logger = logging.getLogger(__name__)

class MessageViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request, recipient_id=None):
        user = request.user

        if recipient_id is not None:
            queryset = Message.objects.filter(
                (Q(message_sender=user) & Q(message_recipient_id=recipient_id)) |
                (Q(message_sender_id=recipient_id) & Q(message_recipient=user))
            )
        else:
            queryset = Message.objects.filter(
                Q(message_sender=user) | Q(message_recipient=user)
            )

        if queryset.exists():
            serializer = MessageSerializer(queryset, many=True)
            return Response(serializer.data)
        else:
            return Response([], status=status.HTTP_200_OK)


    def create(self, request):
        user = request.user

        recipient_id = request.data.get('recipient_id')
        content = request.data.get('content')

        if not recipient_id or not content:
            return Response(
                {'error': 'recipient_id and content are required fields'},
                status=status.HTTP_400_BAD_REQUEST
            )

        message = Message(
            message_sender=user,
            message_recipient_id=recipient_id,
            content=content,
            send_date=datetime.now(),
        )

        message.save()

        serializer = MessageSerializer(message)
        return Response(serializer.data, status=status.HTTP_201_CREATED)




def user_posts_api(request, username):
    user = get_object_or_404(CustomUser, username=username)
    posts = Post.objects.filter(author=user).values(
        'id', 'content', 'image_post', 'upload_date', 'labels'
    )

    following = list(user.user_follows.values('id', 'username'))

    followers = list(user.user_follows.all().filter(user_follows=user).values('id', 'username'))  # Relation inverse

    data = {
        'id': user.id,
        'username': user.username,
        'profile_picture': user.profile_picture.url if user.profile_picture else None,
        'posts': list(posts),
        'followers': followers,
        'following': following
    }
    return JsonResponse(data)

@api_view(['POST'])
def upload_file_to_storage(request):
    try:
        if 'file' not in request.FILES:
            return Response({'error': 'No files sent'}, status=status.HTTP_400_BAD_REQUEST)

        uploaded_file = request.FILES['file']

        client = storage.Client()
        bucket = client.bucket('graph-connect_bucket')

        blob = bucket.blob(uploaded_file.name)
        blob.upload_from_file(uploaded_file)

        file_url = f"https://storage.googleapis.com/{bucket.name}/{blob.name}"

        return Response({'message': 'File successfully uploaded', 'file_url': file_url}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def file_used_for_vision(request):
    """Provides a quick start example for Cloud Vision."""

    client = vision.ImageAnnotatorClient()

    file_url = request.data.get('file_url')

    if not file_url:
        return Response({"error": "No file URL provided."}, status=400)

    image = vision.Image()
    image.source.image_uri = file_url

    try:
        response = client.label_detection(image=image)

        if response.error.message:
            raise Exception(f"Vision API Error: {response.error.message}")

        labels = response.label_annotations
        label_descriptions = [label.description for label in labels] if labels else []

        return Response({"labels": label_descriptions}, status=200)

    except Exception as e:
        return Response({"error": f"Vision processing failed: {str(e)}"}, status=500)



import numpy as np
import faiss

def labels_set(posts):
    all_labels = set()
    for post in posts:
        all_labels.update(post.labels)
    return list(all_labels)

def vectorize_labels(post_labels, label_set):
    vector = np.zeros(len(label_set), dtype=np.float32)
    for label in post_labels:
        if label in label_set:
            index = label_set.index(label)
            vector[index] = 1
    return vector

def normalize_vectors(vectors):
    norms = np.linalg.norm(vectors, axis=1, keepdims=True)
    return vectors / (norms + 1e-10)

class PostRecommendationView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if not user.is_authenticated:
            return JsonResponse({'error': 'No user connected'}, status=401)

        all_posts = list(Post.objects.all())

        liked_posts = list(user.liked_posts.all())

        if not liked_posts:
            return JsonResponse({'error': 'empty'}, status=400)


        label_list = labels_set(all_posts)
        print(f'All labels: {label_list}')

        liked_post_ids = [post.id for post in liked_posts]

        liked_vectors = np.array([vectorize_labels(post.labels, label_list) for post in liked_posts],
                                 dtype=np.float32)
        liked_vectors = normalize_vectors(liked_vectors)
        print(f'Liked vectors: {liked_vectors}')

        query_vector = np.mean(liked_vectors, axis=0, keepdims=True)
        query_vector = normalize_vectors(query_vector)
        print(f'Query vector: {query_vector}')


        post_vectors = np.array([vectorize_labels(post.labels, label_list) for post in all_posts], dtype=np.float32)
        post_vectors = normalize_vectors(post_vectors)
        print(f'All post vectors: {post_vectors}')

        index = faiss.IndexFlatIP(post_vectors.shape[1])
        index.add(post_vectors)
        print(f'Index: {index}')

        k = 5
        distances, indices = index.search(query_vector, k)

        recommended_posts = []
        for i in indices[0]:
            post = all_posts[i]
            if post.id not in liked_post_ids:
                recommended_posts.append(post)

        return Response({
            "recommended_posts": PostSerializer(recommended_posts, many=True).data
        })