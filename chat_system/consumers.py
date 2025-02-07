import json
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model
from chat_system.models import Message
from django.shortcuts import get_object_or_404
from django.db.models import Q

CustomUser = get_user_model()


# 📌 Récupérer un utilisateur par son ID (asynchrone)
@database_sync_to_async
def get_user(user_id):
    return CustomUser.objects.filter(id=user_id).first()


# 📌 Récupérer un destinataire par son ID (asynchrone)
@database_sync_to_async
def get_recipient(recipient_id):
    return CustomUser.objects.filter(id=recipient_id).first()


# 📌 Sauvegarder un message (asynchrone)
@database_sync_to_async
def create_chat(sender_id, recipient_id, message):
    sender = CustomUser.objects.get(id=sender_id)
    recipient = get_object_or_404(CustomUser, id=recipient_id)
    return Message.objects.create(content=message, message_sender=sender, message_recipient=recipient)


# 📌 Récupérer les messages entre deux utilisateurs (asynchrone)
@database_sync_to_async
def get_chat_messages(sender_id, recipient_id):
    return list(
        Message.objects.filter(
            (Q(message_sender_id=sender_id) & Q(message_recipient_id=recipient_id)) |
            (Q(message_sender_id=recipient_id) & Q(message_recipient_id=sender_id))
        ).values("message_sender_id", "message_recipient_id", "content", "send_date")
    )


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'
        self.user = self.scope['user']  # L'utilisateur connecté

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

        # 🔥 Charger les anciens messages au moment de la connexion
        recipient_id = int(self.room_name)  # ID de l'autre utilisateur
        messages = await get_chat_messages(self.user.id, recipient_id)

        # 🔄 Envoyer les anciens messages au client
        for msg in messages:
            await self.send(text_data=json.dumps({
                'sender': msg["message_sender_id"],
                'recipient': msg["message_recipient_id"],
                'message': msg["content"],
            }))

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
            recipient = await get_recipient(recipient_id)

            if not sender or not recipient:
                await self.send(text_data=json.dumps({'error': 'Invalid sender or recipient'}))
                return

            # 🔥 Envoyer le message à la room WebSocket
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

        # 🔥 Sauvegarder le message (asynchrone)
        await create_chat(sender, recipient, message)

        # 🔄 Envoyer le message au client WebSocket
        await self.send(text_data=json.dumps({
            'sender': sender,
            'recipient': recipient,
            'message': message
        }))
