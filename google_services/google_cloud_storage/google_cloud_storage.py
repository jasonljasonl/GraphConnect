from google.cloud import storage
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from storages.backends.gcloud import GoogleCloudStorage
import uuid
from django.conf import settings


@api_view(['POST'])
def upload_file_to_storage(request):
    try:
        if 'file' not in request.FILES:
            return Response({'error': 'No files sent'}, status=status.HTTP_400_BAD_REQUEST)

        uploaded_file = request.FILES['file']

        client = storage.Client()
        bucket = client.bucket('graph-connect_bucket')

        blob = bucket.blob(f"{uuid.uuid4()}_{uploaded_file.name}")
        blob.upload_from_file(uploaded_file)

        file_url = f"https://storage.googleapis.com/{bucket.name}/{blob.name}"

        return Response({'message': 'File successfully uploaded', 'file_url': file_url}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)





class PublicMediaStorage(GoogleCloudStorage):
    location = "media"
    bucket_name = settings.GS_BUCKET_NAME

