#!/bin/sh

# Vérification si Cloud SQL Proxy est déjà présent
if [ ! -f "/usr/local/bin/cloud_sql_proxy" ]; then
  echo "Le fichier cloud_sql_proxy n'existe pas. Téléchargement..."
  curl -o /cloud_sql_proxy https://storage.googleapis.com/cloudsql-proxy/v1.33.4/cloud_sql_proxy.linux.amd64
  chmod +x /cloud_sql_proxy
  mv /cloud_sql_proxy /usr/local/bin/cloud_sql_proxy
fi

# Vérifier si le fichier est bien exécutable
ls -lah /usr/local/bin/cloud_sql_proxy

# Lancer le proxy Cloud SQL
cloud_sql_proxy -dir=/cloudsql -ip_address=34.79.74.37 &

# Attendre que la base de données soit prête
echo "Waiting for the database..."
while ! nc -z 34.79.74.37 5432; do
  sleep 1
done
echo "Database is ready."

# Appliquer les migrations
echo "Applying migrations..."
python manage.py migrate --noinput

# Collecter les fichiers statiques
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Démarrer Gunicorn pour servir l'application
echo "Starting Gunicorn..."
exec gunicorn GraphConnectSettings.wsgi:application --bind 0.0.0.0:8080
