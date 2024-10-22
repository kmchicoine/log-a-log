from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Directory for uploaded photos
UPLOAD_FOLDER = './photos'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Route to handle photo upload
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"})
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"})
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))
    return jsonify({"success": "File uploaded successfully"})

# Route to get all locations with reviews, ratings, and photos
@app.route('/locations', methods=['GET'])
def get_locations():
    # Placeholder for fetching locations from a database
    locations = [
        {"id": 1, "name": "Location 1", "lat": 44.0, "lng": -121.0, "rating": 4, "photos": []},
        {"id": 2, "name": "Location 2", "lat": 44.1, "lng": -121.1, "rating": 5, "photos": []},
    ]
    return jsonify(locations)

if __name__ == '__main__':
    app.run(debug=True)
