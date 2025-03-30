#!/bin/sh

# Start the Cloud SQL proxy
echo "Starting Cloud SQL proxy..."
/cloud_sql_proxy -dir=/cloudsql -instances=graphconnect:europe-west1:graphconnect-db &

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
