from django.shortcuts import render, redirect
from .forms import CustomUserCreationForm, CustomAuthenticationForm
from django.contrib.auth import login, authenticate, logout


# Create your views here.
def register(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)

            return redirect('success')
    else:
        form = CustomUserCreationForm()
        return render(request, 'accounts/register.html', {'form':form})


def user_login(request):
    if request.method == 'POST':
        form = CustomAuthenticationForm(request, request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request,username=username,password=password)
            if user is not None:
                login(request, user)
                return redirect('success')
    else:
        form = CustomAuthenticationForm()
    return render(request, 'accounts/login.html', {'form':form})


def success(request):
    return render(request, 'accounts/success.html')


def user_logout(request):
    logout(request)
    return redirect('register')