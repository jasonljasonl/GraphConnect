# Use a minimal Python image
FROM python:3.12-slim

WORKDIR /app

# Install necessary dependencies including curl, gnupg, ca-certificates
RUN apt-get update && apt-get install -y curl gnupg ca-certificates lsb-release

# Manually download and add Google Cloud SDK GPG key
RUN curl -fsSL https://packages.cloud.google.com/apt/doc/apt-key.gpg | tee /usr/share/keyrings/cloud.google.gpg > /dev/null

# Add Google Cloud SDK repository
RUN echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" \
    | tee /etc/apt/sources.list.d/google-cloud-sdk.list

# Update apt and install google-cloud-sdk
RUN apt-get update && apt-get install -y google-cloud-sdk

# Install additional dependencies for Python development and PostgreSQL
RUN apt-get install -y python3-dev libpq-dev curl netcat-openbsd

# Download Cloud SQL Proxy
RUN curl -o /cloud_sql_proxy https://storage.googleapis.com/cloudsql-proxy/v1.33.4/cloud_sql_proxy.linux.amd64 && \
    chmod +x /cloud_sql_proxy

# Copy requirements and install them
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY . .

# Set environment variables (Make sure they are available at runtime)
ENV DATABASE_HOST="/cloudsql/graphconnect:europe-west1:graphconnect-db"
ENV DATABASE_PORT=5432
ENV DJANGO_SETTINGS_MODULE=GraphConnectSettings.settings
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

EXPOSE 8080

# Copy and give execution permissions to entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Set entrypoint to the script
ENTRYPOINT ["/entrypoint.sh"]
