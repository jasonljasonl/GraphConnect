FROM python:3.9-slim-buster

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
ENV DJANGO_SETTINGS_MODULE=GraphConnect.settings
ENV PYTHONUNBUFFERED=1
ENV PORT 8080

EXPOSE 8080

CMD ["python", "manage.py", "runserver", "0.0.0.0:$PORT"]