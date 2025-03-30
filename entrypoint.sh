#!/bin/sh

# Start Cloud SQL Proxy in the background
./cloud_sql_proxy -dir=/cloudsql -instances=graphconnect:europe-west1:graphconnect-db &
PROXY_PID=$!

# Wait for Cloud SQL Proxy to be ready
echo "Waiting for Cloud SQL Proxy to start..."
sleep 5  # Gives the proxy time to establish the connection

# Start Django application
exec python manage.py runserver 0.0.0.0:8000

# Wait for the database to be ready
echo "Waiting for the database..."
while ! nc -z /cloudsql/graphconnect:europe-west1:graphconnect-db 5432; do
  sleep 1
done
echo "Database is ready."

# Apply migrations
echo "Applying migrations..."
python manage.py migrate --noinput

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Start Gunicorn
echo "Starting Gunicorn..."
exec gunicorn GraphConnectSettings.wsgi:application --bind 0.0.0.0:8080

