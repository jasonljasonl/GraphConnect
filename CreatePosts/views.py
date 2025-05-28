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
from GraphConnectSettings.serializer import PostSerializer, CommentSerializer
from .models import Comment
from django.views.generic import ListView, CreateView, UpdateView, DeleteView, DetailView
from rest_framework import viewsets, generics, status
from CreatePosts.models import Post
from account.models import CustomUser, Follow
import numpy as np
import faiss


class PostsSerializerView(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    queryset = Post.objects.all()


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def delete_post_api(request, pk):
    post = get_object_or_404(Post, pk=pk)

    if request.user != post.author:
        return Response({'error': 'You do not have permission to delete this post'}, status=status.HTTP_403_FORBIDDEN)

    post.delete()
    return Response({'message': 'Post deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


def get_comment_count(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
        comment_count = post.comments.count()
        return JsonResponse({"count": comment_count})
    except Post.DoesNotExist:
        return JsonResponse({"error": "Post not found"}, status=404)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
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
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def PostLikeView(request, pk):
    try:
        post = Post.objects.get(id=pk)

        if request.user in post.likes.all():
            post.likes.remove(request.user)
        else:
            post.likes.add(request.user)
        post.save()

        return JsonResponse({'message': 'Post liked successfully'})
    except Post.DoesNotExist:
        return JsonResponse({'error': 'Post not found'}, status=404)





@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def check_like_status(request, post_id):
    try:
        post = get_object_or_404(Post, id=post_id)
        user = request.user

        has_liked = post.likes.filter(id=user.id).exists()

        return Response({'liked': has_liked})

    except Exception:
        return Response({'error': 'An error occurred'}, status=500)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def check_comment_like_status(request, comment_id):
    try:
        comment = get_object_or_404(Comment, id=comment_id)
        user = request.user

        has_liked = comment.likes.filter(id=user.id).exists()

        return Response({'liked': has_liked})

    except Exception:
        return Response({'error': 'An error occurred'}, status=500)


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

class CommentsSerializerView(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()

class PostDetailSerializerView(generics.RetrieveAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    lookup_field = 'id'

class FollowedPostsListView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        user = self.request.user
        followed_users = user.following.values_list('to_user', flat=True)
        return Post.objects.filter(Q(author__in=followed_users) | Q(author=user))


def user_posts_api(request, username):
    user = get_object_or_404(CustomUser, username=username)

    posts = Post.objects.filter(author=user).values(
        'id', 'content', 'image_post', 'upload_date', 'labels'
    )

    following = Follow.objects.filter(from_user=user).values('to_user__id', 'to_user__username')

    followers = list(user.followers.values('to_user__id', 'to_user__username'))

    data = {
        'id': user.id,
        'username': user.username,
        'profile_picture': user.profile_picture if user.profile_picture else None,
        'posts': list(posts),
        'followers': followers,
        'following': list(following)
    }

    return JsonResponse(data)

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

        liked_post_ids = [post.id for post in liked_posts]

        liked_vectors = np.array([vectorize_labels(post.labels, label_list) for post in liked_posts],
                                 dtype=np.float32)
        liked_vectors = normalize_vectors(liked_vectors)

        query_vector = np.mean(liked_vectors, axis=0, keepdims=True)
        query_vector = normalize_vectors(query_vector)


        post_vectors = np.array([vectorize_labels(post.labels, label_list) for post in all_posts], dtype=np.float32)
        post_vectors = normalize_vectors(post_vectors)

        index = faiss.IndexFlatIP(post_vectors.shape[1])
        index.add(post_vectors)

        k = 500
        distances, indices = index.search(query_vector, k)

        recommended_posts = []
        for i in indices[0]:
            post = all_posts[i]
            if post.id not in liked_post_ids:
                recommended_posts.append(post)
        recommended_posts = list({post.id: post for post in recommended_posts}.values())

        return Response({
            "recommended_posts": PostSerializer(recommended_posts, many=True).data
        })