import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model

from chat_system.models import Messages

CustomUser = get_user_model()

from django.shortcuts import render

def chat_room(request, room_name):
    user = request.user
    return render(request, 'room.html', {
        'room_name': room_name,
        'username': user.id,
    })


@database_sync_to_async
def get_user(sender_id):
    try:
        return CustomUser.objects.get(id=sender_id)
    except CustomUser.DoesNotExist:
        return None


class ChatConsumer(AsyncWebsocketConsumer):

    @database_sync_to_async
    def create_chat(self, sender_id, message):
        try:
            sender = CustomUser.objects.get(id=sender_id)
            return Messages.objects.create(sender=sender, content=message)
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

            sender = await get_user(sender_id)

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'sender': sender.id
                }
            )

        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({'error': 'Invalid JSON'}))

    async def chat_message(self, event):
        sender = event['sender']
        message = event['message']

        await self.create_chat(sender, message)

        await self.send(text_data=json.dumps({'sender': sender, 'message': message}))
