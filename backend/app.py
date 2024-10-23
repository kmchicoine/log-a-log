from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__, static_folder='/frontend/build', static_url_path='')
CORS(app)

class Location:
    def __init__(self, id, lat, lng, title=None, description=None):
        self.id = id
        self.lat = lat
        self.lng = lng
        self.title = title
        self.description = description

    #serialize to JSON
    def to_dict(self):
        return {
            'id': self.id,
            'lat': self.lat,
            'lng': self.lng,
            'title': self.title,
            'description': self.description,
        }
    
#In-memory store for tagged locations
DEFAULT_LOCATION = Location(id=0, lat=44.0582, lng=-121.3153, title='init',description='init')
locations = [DEFAULT_LOCATION]

#@app.route('/')
#def home():
#    return jsonify({"message": "Flask backend is running!"})

#Route to get all locations
@app.route('/api/locations', methods=['GET'])
def get_locations():
    response = jsonify([location.to_dict() for location in locations])
    print('Returning response:', response)
    return response, 200

#Route to add a new location
@app.route('/api/locations', methods=['POST'])
def add_location():
    data = request.get_json()
    # Create a new location object
    title = ''
    if 'title' in data:
        title = data['title']

    description = ''
    if 'description' in data:
        description = data['description']

    new_location = Location(
        id=len(locations) + 1,
        lat=data['lat'],
        lng=data['lng'],
        title=title,
        description=description
    )

    locations.append(new_location)
    return jsonify(new_location.to_dict()), 201

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
