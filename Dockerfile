FROM python:3.12-slim

WORKDIR /app
RUN mkdir -p /cloudsql

RUN apt-get update && apt-get install -y curl gnupg ca-certificates && \
    curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | tee /usr/share/keyrings/cloud.google.gpg && \
    echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | tee /etc/apt/sources.list.d/google-cloud-sdk.list && \
    apt-get update && apt-get install -y google-cloud-sdk


RUN apt-get update && apt-get install -y python3-dev libpq-dev

# Installer curl et netcat
RUN apt-get update && apt-get install -y curl netcat-openbsd

# Télécharger le proxy Cloud SQL
RUN curl -o /cloud_sql_proxy https://storage.googleapis.com/cloudsql-proxy/v1.33.4/cloud_sql_proxy.linux.amd64 && \
    chmod +x /cloud_sql_proxy

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

ARG DATABASE_NAME
ARG DATABASE_USER
ARG DATABASE_PASSWORD
ARG DATABASE_HOST
ARG DATABASE_PORT

ENV DATABASE_NAME=${DATABASE_NAME}
ENV DATABASE_USER=${DATABASE_USER}
ENV DATABASE_PASSWORD=${DATABASE_PASSWORD}
ENV DATABASE_HOST=/cloudsql/graphconnect:europe-west1:graphconnect-db
ENV DATABASE_PORT=5432

ENV DJANGO_SETTINGS_MODULE=GraphConnectSettings.settings
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

EXPOSE 8080

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
