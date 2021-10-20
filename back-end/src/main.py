from flask import Flask
from db import db_init
from models import University, Housing, Amenities, amenities_schema

app = Flask(__name__)
db = db_init(app)

@app.route('/')
def home():
    return 'hello world'

@app.route('/amenities', methods=['GET'])
def amenities():
    amenities_query = Amenities.query.all()
    return amenities_schema.dumps(amenities_query, many=True)

@app.route('/amenities/<int:amen_id>', methods=['GET'])
def amenities_id(amen_id):
    amenities_query = Amenities.query.filter_by(amen_id=amen_id).first()
    return amenities_schema.dumps(amenities_query)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)