from flask import Flask, render_template, request
from azure.cognitiveservices.vision.customvision.prediction import CustomVisionPredictionClient
from msrest.authentication import ApiKeyCredentials
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

# Load Azure Custom Vision credentials from .env file
key = os.getenv('KEY')
endpoint = os.getenv('ENDPOINT')
project_id = os.getenv('PROJECT_ID')
published_name = os.getenv('PUBLISHED_ITERATION_NAME')

# Setup credentials for client
credentials = ApiKeyCredentials(in_headers={'Prediction-key':key})
# Create client, which will be used to make predictions
client = CustomVisionPredictionClient(endpoint, credentials)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return "No file part"
    file = request.files['file']
    if file.filename == '':
        return "No selected file"
    if file:
        results = client.classify_image(project_id, published_name, file.read())
        predictions = [(prediction.tag_name, f"{prediction.probability:.2%}") for prediction in results.predictions]
        return render_template('result.html', predictions=predictions)

if __name__ == '__main__':
    app.run(debug=True)
