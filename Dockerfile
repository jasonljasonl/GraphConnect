FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

RUN chmod +x /app/start.sh

ENV DJANGO_SETTINGS_MODULE=GraphConnectSettings.settings
ENV PYTHONUNBUFFERED=1
ENV PORT 8080

EXPOSE 8080

CMD ["/app/start.sh"]