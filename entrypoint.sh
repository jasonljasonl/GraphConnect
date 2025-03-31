#!/bin/sh

# Start Cloud SQL Proxy with the IP address of Cloud SQL
./cloud_sql_proxy -dir=/cloudsql -ip_address=34.79.74.37 &

# Get the PID of Cloud SQL Proxy to manage it later
PROXY_PID=$!

# Wait for Cloud SQL Proxy to be ready
echo "Waiting for Cloud SQL Proxy to start..."
sleep 5  # Gives the proxy time to establish the connection

# Wait for the database to be ready via TCP
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

# Start Gunicorn to serve the application
echo "Starting Gunicorn..."
exec gunicorn GraphConnectSettings.wsgi:application --bind 0.0.0.0:8080
