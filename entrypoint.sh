#!/bin/sh

echo "En attente de la base de données..."
while ! nc -z "$DATABASE_HOST" "$DATABASE_PORT"; do
  sleep 1
done
echo "Base de données prête."

echo "Application des migrations..."
#python manage.py migrate --noinput

echo "Collecte des fichiers statiques..."
#python manage.py collectstatic --noinput

echo "Démarrage de Gunicorn..."
exec gunicorn GraphConnectSettings.wsgi:application --bind 0.0.0.0:8080
