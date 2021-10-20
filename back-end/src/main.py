from flask import Flask, Response
from db import db_init
from models import University, Housing, Amenities, amenities_schema
import json

app = Flask(__name__)
db = db_init(app)

@app.route('/')
def home():
    return 'hello world'

@app.route('/amenities', methods=['GET'])
def amenities():
    amenities = Amenities.query.all()
    return amenities_schema.jsonify(amenities, many=True)

@app.route('/amenities/<int:amen_id>', methods=['GET'])
def amenities_id(amen_id):
    amenity = Amenities.query.get(amen_id)
    if amenity is None:
        response = Response(
            json.dumps({'error': 'id ' + str(amen_id) + ' not found'}), 
            mimetype='application/json'
        )
        response.status_code = 404
        return response
    return amenities_schema.jsonify(amenity)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)