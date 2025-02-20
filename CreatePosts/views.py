from OpenSSL.rand import status
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

from .models import Post, Comment
from django.views.generic import ListView, CreateView, UpdateView, DeleteView, DetailView

from rest_framework import viewsets, serializers, generics

from CreatePosts.models import Post
from account.models import CustomUser


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


class PostDeleteView(LoginRequiredMixin,UserPassesTestMixin,DeleteView):
    model = Post
    template_name = 'post_confirm_delete.html'
    success_url = reverse_lazy('post_list')

    def test_func(self, **kwargs):
        post = self.get_object()
        return self.request.user == post.author






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


class CommentLikeView(LoginRequiredMixin, View):
    def post(self, request, *args, **kwargs):
        comment = get_object_or_404(Comment, id=kwargs['pk'])
        if request.user in comment.likes.all():
            comment.likes.remove(request.user)
        else:
            comment.likes.add(request.user)
        return redirect('post_list')


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


class CommentCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id, *args, **kwargs):
        post = get_object_or_404(Post, pk=post_id)
        serializers = CommentSerializer(data=request.data)
        if serializers.is_valid():
            serializers.save(author=request.user, related_post=post)
            return Response(serializers.data)
        return Response(serializers.errors)




class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'

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

