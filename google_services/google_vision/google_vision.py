from google.cloud import vision
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['POST'])
def file_used_for_vision(request):
    """Provides a quick start example for Cloud Vision."""

    client = vision.ImageAnnotatorClient()

    file_url = request.data.get('file_url')

    if not file_url:
        return Response({"error": "No file URL provided."}, status=400)

    image = vision.Image()
    image.source.image_uri = file_url

    try:
        response = client.label_detection(image=image)

        if response.error.message:
            raise Exception(f"Vision API Error: {response.error.message}")

        labels = response.label_annotations
        label_descriptions = [label.description for label in labels] if labels else []

        return Response({"labels": label_descriptions}, status=200)

    except Exception as e:
        return Response({"error": f"Vision processing failed: {str(e)}"}, status=500)
