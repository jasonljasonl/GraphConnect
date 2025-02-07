import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model

from chat_system.models import Message

CustomUser = get_user_model()

from django.shortcuts import render, get_object_or_404


def chat_room(request, room_name,**kwargs):
    user = request.user
    recipient = get_object_or_404(CustomUser, id=kwargs['pk'])
    return render(request, 'room.html', {
        'room_name': room_name,
        'username': user.id,
        'recipient': recipient.id,
    })


@database_sync_to_async
def get_user(sender_id):
    try:
        return CustomUser.objects.get(id=sender_id)
    except CustomUser.DoesNotExist:
        return None




class ChatConsumer(AsyncWebsocketConsumer):

    @database_sync_to_async
    def create_chat(self, sender_id, recipient_id, message):
        try:
            sender = CustomUser.objects.get(id=sender_id)
            recipient = CustomUser.objects.get(id=recipient_id)
            Message.objects.create(content=message,message_sender=sender, message_recipient=recipient)
        except CustomUser.DoesNotExist:
            return None

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            print("Received data:", text_data_json)

            message = text_data_json.get('message', '')
            sender_id = text_data_json.get('sender')
            recipient_id = text_data_json.get('recipient')

            sender = await get_user(sender_id)
            recipient = await get_user(recipient_id)

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'sender': sender.id,
                    'recipient': recipient.id
                }
            )

        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({'error': 'Invalid JSON'}))

    async def chat_message(self, event):
        sender = event['sender']
        message = event['message']
        recipient = event['recipient']

        await self.create_chat(sender, recipient, message)

        await self.send(text_data=json.dumps({'sender': sender, 'recipient':recipient, 'message': message}))
