from google.cloud import vision

def run_quickstart():
    """Provides a quick start example for Cloud Vision."""

    # Instantiates a client
    client = vision.ImageAnnotatorClient()

    # The URI of the image file to annotate
    file_uri = "gs://graph-connect_bucket/Screenshot 2025-03-10 at 12.09.27.png"

    image = vision.Image()
    image.source.image_uri = file_uri

    # Performs label detection on the image file
    response = client.label_detection(image=image)

    # Check for errors
    if response.error.message:
        print(f"API Error: {response.error.message}")
        return

    labels = response.label_annotations

    if not labels:
        print("No labels detected.")
        return

    print("Labels:")
    for label in labels:
        print(label.description)

run_quickstart()
