from rest_framework import viewsets, serializers

from CreatePosts.models import Post, Comment
from account.models import CustomUser, Follow
from chat_system.models import Message


class CustomUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = ['id','username', 'email', 'password', 'name', 'profile_picture']

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user

    def get_follows(self, obj):
        follows = Follow.objects.filter(follower=obj)
        return [follow.followed.id for follow in follows]



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


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'message_sender', 'message_recipient', 'content', 'send_date']


class FollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follow
        fields = ['follower', 'followed', 'created_at']
        read_only_fields = ['follower', 'created_at']