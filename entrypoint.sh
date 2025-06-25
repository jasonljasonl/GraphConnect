#!/bin/sh

# Démarrer Cloud SQL Proxy v2 en arrière-plan
# echo "Starting Cloud SQL Proxy v2..."
# /usr/local/bin/cloud_sql_proxy -dir=/cloudsql -credential_file=$GOOGLE_APPLICATION_CREDENTIALS graphconnect:europe-west1:graphconnect-db &

# Attendre quelques secondes pour s'assurer que le Cloud SQL Proxy est bien démarré
# sleep 5

# Vérifier si le socket est accessible
# if [ ! -S /cloudsql/graphconnect:europe-west1:graphconnect-db/.s.PGSQL.5432 ]; then
#   echo "Cloud SQL Proxy is not running. Exiting."
#   exit 1
# fi

echo "Checking for missing migrations..."
python manage.py makemigrations --check --dry-run || python manage.py makemigrations

# Appliquer les migrations
echo "Applying migrations..."
python manage.py migrate --noinput

# Collecter les fichiers statiques
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Démarrer Gunicorn pour servir l'application
echo "Starting Gunicorn..."
exec gunicorn GraphConnectSettings.wsgi:application --bind 0.0.0.0:8080
