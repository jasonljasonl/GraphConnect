# Use a minimal Python image
FROM python:3.12-slim

# Set the working directory
WORKDIR /app

# Install necessary dependencies
RUN apt-get update && apt-get install -y curl gnupg ca-certificates lsb-release postgresql-client

# Add Google Cloud SDK public key
RUN curl -fsSL https://packages.cloud.google.com/apt/doc/apt-key.gpg | \
    gpg --dearmor -o /usr/share/keyrings/cloud.google.gpg

# Add Google Cloud SDK repository
RUN echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" \
    | tee /etc/apt/sources.list.d/google-cloud-sdk.list

# Update apt and install Google Cloud SDK
RUN apt-get update && apt-get install -y google-cloud-sdk

# Install additional dependencies for Python development and PostgreSQL
RUN apt-get install -y python3-dev libpq-dev netcat-openbsd

# Install Cloud SQL Proxy v2 (version 2.x is the latest version as per the migration guide)
RUN curl -fsSL https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64 -o /usr/local/bin/cloud_sql_proxy && \
    chmod +x /usr/local/bin/cloud_sql_proxy

# Copy and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application source code
COPY . .

# Set environment variables
ENV DATABASE_HOST=127.0.0.1
ENV DATABASE_USER=postgres
ENV DATABASE_PASSWORD=jasonlndmsocialapp2025
ENV DATABASE_PORT=5432
ENV DJANGO_SETTINGS_MODULE=GraphConnectSettings.settings
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

# Expose the application port
EXPOSE 8080

# Copy and set permissions for the entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Set the entrypoint script
ENTRYPOINT ["/entrypoint.sh"]
