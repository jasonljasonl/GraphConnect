#!/bin/bash
python manage.py makemigrations
python manage.py migrate --noinput
gunicorn GraphConnectSettings.wsgi:application --bind 0.0.0.0:$PORT