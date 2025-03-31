#!/bin/sh

# Vérifiez si le fichier cloud_sql_proxy existe
if [ ! -f "./cloud_sql_proxy" ]; then
  echo "Le fichier cloud_sql_proxy n'existe pas. Téléchargement..."
  # Télécharger cloud_sql_proxy si le fichier n'existe pas
  curl -o /cloud_sql_proxy https://storage.googleapis.com/cloudsql-proxy/v1.33.4/cloud_sql_proxy.linux.amd64 && \
    chmod +x /cloud_sql_proxy
fi

# Démarrer le Cloud SQL Proxy avec l'adresse IP de Cloud SQL
if [ -z "$CLOUD_SQL_INSTANCE" ]; then
  # Utilisation de l'adresse IP si le socket est indisponible
  ./cloud_sql_proxy -dir=/cloudsql -ip_address=34.79.74.37 &
else
  # Utilisation du socket Cloud SQL si dans GCP
  ./cloud_sql_proxy -dir=/cloudsql &
fi

# Récupérer le PID du Cloud SQL Proxy pour le gérer ensuite
PROXY_PID=$!

# Attendre que le Cloud SQL Proxy soit prêt
echo "Waiting for Cloud SQL Proxy to start..."
sleep 5  # Laisser du temps pour établir la connexion

# Attendre que la base de données soit prête via TCP
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
