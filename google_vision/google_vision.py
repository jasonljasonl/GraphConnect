from google.cloud import vision

def run_quickstart():

    client = vision.ImageAnnotatorClient()

    image_path = "../uploaded_images/uploaded_images/img.jpg"
    with open(image_path, "rb") as image_file:
        content = image_file.read()

    image = vision.Image(content=content)

    response = client.label_detection(image=image)

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
