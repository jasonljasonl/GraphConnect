from django.shortcuts import render, get_object_or_404
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views import View

from account import models
from chat_system.models import Message
from account.models import CustomUser


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
            'messages': messages,  # On envoie les messages au template
        })

