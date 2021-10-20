import flask
import json
from flask import Flask, jsonify, request
from flask.templating import render_template
from db import db_init
from models import University, Housing, Amenities
from flask_marshmallow import Marshmallow
from marshmallow import fields, validate

app = Flask(__name__)
db = db_init(app)
ma = Marshmallow(app)

@app.route('/')
def home():
    return 'hello world'

class HousingSchema(ma.Schema):

    property_id = fields.Str(required=True)
    property_name = fields.Str(required=True)
    property_type = fields.Str(required=True, validate=validate.OneOf(['apartment', 'condo', 'house','townhome']))
    location = fields.Method('format_location')
    address = fields.Str(required=True)
    neighborhood = fields.Str(required=True)
    city = fields.Str(required=True)
    state = fields.Str(required=True)
    rating = fields.Float(missing=0.0)
    walk_score = fields.Int()
    transit_score = fields.Int()
    min_rent = fields.Int(required=True)
    max_rent = fields.Function(lambda obj: obj.min_rent if obj.max_rent is None else obj.max_rent)
    bed = fields.Method('format_bedroom')
    bath = fields.Method('format_bathroom')
    min_sqft = fields.Float()
    max_sqft = fields.Float()
    sqft = fields.Method('format_space')
    dog_allow = fields.Boolean()
    cat_allow = fields.Boolean()

    def format_bedroom(self, property):
        if property.max_bed is None:
            property.max_bed = property.min_bed
        return {'min': property.min_bed,
                'max': property.max_bed}
    
    def format_bathroom(self, property):
        if property.max_bath is None:
            property.max_bath = property.min_bath
        return {'min': property.min_bath,
                'max': property.max_bath}

    def format_space(self, property):
        return {'min': property.min_sqft,
                'max': property.max_sqft}

    def format_location(self, property):
        return {'address': property.address,
                'neighborhood': property.neighborhood,
                'city': property.city,
                'state': property.state,
                'zipcode': property.zip_code}

single_housing_schema = HousingSchema()

# table view 
table_columns = ('property_name','property_id', 'property_type', 'city', 'state', 'rating', 'walk_score', 'transit_score', 'max_rent', 'max_sqft')
all_housing_schema = HousingSchema(only=table_columns, many=True)

@app.route('/housing', methods=['GET'])
def get_all_housing():
    all_housing = Housing.query.all()
    result = all_housing_schema.dump(all_housing)
    return jsonify({'properties': result})

@app.route('/housing/<string:typ>/<string:id>', methods=['GET'])
def get_housing_by_id(id, typ):
    housing = Housing.query.get((id,typ))
    if housing is None:
        err = flask.Response(
            json.dump({'error': id + ' not found'}),
            mimetype='application/json'
        )
        err.status_code = 404
        return err
    return jsonify(single_housing_schema.dump(housing))

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)