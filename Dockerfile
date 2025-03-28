FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
ENV DJANGO_SETTINGS_MODULE=GraphConnectSettings.settings
ENV PYTHONUNBUFFERED=1
ENV PORT 8080

EXPOSE 8080

CMD ["gunicorn", "GraphConnectSettings.wsgi:application", "--bind", "0.0.0.0:8080"]


#CMD echo $PORT && python manage.py runserver 0.0.0.0:$PORT
