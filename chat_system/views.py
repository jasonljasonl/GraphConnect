from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse

from django.shortcuts import render, get_object_or_404
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views import View
from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from account import models
from account.models import CustomUser
from chat_system.models import Message

# Create your views here.
def index(request):
    return render(request, 'chat/index.html')

def room(request, room_name):
    return render(request, 'chat/room.html', {'room_name':room_name})

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


