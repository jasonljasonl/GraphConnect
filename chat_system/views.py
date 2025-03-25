from datetime import datetime
from django.contrib.auth import get_user_model
from django.db.models import Q
from django.shortcuts import render, get_object_or_404
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views import View
from rest_framework import viewsets, status
from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from GraphConnectSettings.serializer import MessageSerializer
from account import models
from account.models import CustomUser
from chat_system.models import Message

# Create your views here.
class UserChattingView(LoginRequiredMixin, View):
    def post(self, request, **kwargs):
        user = get_object_or_404(CustomUser, id=kwargs['pk'])
        recipient = user
        sender = request.user

        messages = Message.objects.filter(
            (models.Q(message_sender=sender) & models.Q(message_recipient=recipient)) |
            (models.Q(message_sender=recipient) & models.Q(message_recipient=sender))
        ).order_by("send_date")

        return render(request, 'chat/room.html', {
            'room_name': user.id,
            'recipient': recipient,
            'messages': messages,
        })



User = get_user_model()

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_chat_users(request):
    try:
        user = request.user

        sent_messages = Message.objects.filter(message_sender=user).values_list("message_recipient", flat=True)
        received_messages = Message.objects.filter(message_recipient=user).values_list("message_sender", flat=True)

        chat_user_ids = set(sent_messages) | set(received_messages)

        if not chat_user_ids:
            return Response({"message": "No chat available"}, status=200)

        chat_users = User.objects.filter(id__in=chat_user_ids)

        users_data = [
            {
                "id": user.id,
                "username": user.username,
                "profile_picture": request.build_absolute_uri(user.profile_picture.url) if user.profile_picture else None,
            }
            for user in chat_users
        ]

        return Response(users_data)

    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response({"error": str(e)}, status=500)



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
