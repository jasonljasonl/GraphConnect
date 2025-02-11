
from django.shortcuts import get_object_or_404, render, get_list_or_404
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.shortcuts import redirect
from django.views import View
from rest_framework.reverse import reverse_lazy

from .models import Post, Comment
from django.views.generic import ListView, CreateView, UpdateView, DeleteView, DetailView


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


class PostLikeView(LoginRequiredMixin, View):
    def post(self, request, *args, **kwargs):
        post = get_object_or_404(Post, id=kwargs['pk'])
        if request.user in post.likes.all():
            post.likes.remove(request.user)
        else:
            post.likes.add(request.user)
        return redirect('post_list')


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


