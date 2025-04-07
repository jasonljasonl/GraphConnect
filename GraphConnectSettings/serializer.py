from rest_framework import viewsets, serializers

from CreatePosts.models import Post, Comment
from account.models import CustomUser
from chat_system.models import Message


class CustomUserSerializer(serializers.ModelSerializer):
    profile_picture_upload = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = CustomUser
        fields = ['id','username', 'email', 'password', 'name', 'profile_picture_upload', 'profile_picture']
        read_only_fields = ['profile_picture']

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
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





class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'message_sender', 'message_recipient', 'content', 'send_date']

