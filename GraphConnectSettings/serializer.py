from rest_framework import viewsets, serializers

from CreatePosts.models import Post, Comment
from account.models import CustomUser
from chat_system.models import Message


class CustomUserSerializer(serializers.ModelSerializer):
    profile_picture_url = serializers.CharField(source='profile_picture_url', read_only=True)
    profile_picture_upload = serializers.ImageField(required=False, allow_null=True, write_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password', 'name', 'profile_picture', 'profile_picture_url', 'profile_picture_upload']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        profile_picture_file = validated_data.pop('profile_picture_upload', None)
        user = CustomUser.objects.create_user(**validated_data)

        if profile_picture_file:
            user.profile_picture = profile_picture_file  # Assign the file to the ImageField/FileField
            user.save() # This will trigger django-storages to upload and set the URL

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

