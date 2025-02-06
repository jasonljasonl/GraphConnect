from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import render, get_object_or_404
from django.views import View

from account.models import CustomUser


# Create your views here.
def index(request):
    return render(request, 'chat/index.html')

def room(request, room_name):
    return render(request, 'chat/room.html', {'room_name':room_name})

class UserChattingView(LoginRequiredMixin, View):
    def post(self,request, room_name, **kwargs):
        user = get_object_or_404(CustomUser, id=kwargs['pk'])
        return render(request, 'chat/room.html', {'room_name':user.id})