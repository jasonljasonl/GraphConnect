from django.views import View

from rest_framework import viewsets, serializers

from CreatePosts.models import Post, Comment
from account.models import CustomUser
from chat_system.models import Message


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





class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'message_sender', 'message_recipient', 'content', 'send_date']

