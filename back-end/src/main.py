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
<<<<<<< HEAD

class AmenitiesImagesSchema(ma.Schema):
    id = fields.Int(required=True)
    amen_id = fields.Int(required=True)
    url = fields.Str(required=True)
class AmenitiesReviewsSchema(ma.Schema):
    id = fields.Int(required=True)
    amen_id = fields.Int(required=True)
    review_id = fields.Str(required=True)
    user_id = fields.Str(required=True)
    user_name = fields.Str(required=True)

class AmenitiesCategoriesSchema(ma.Schema):
    id = fields.Int(required=True)
    amen_id = fields.Int(required=True)
    category = fields.Str(required=True)
class AmenitiesSchema(ma.Schema):
    amen_id = fields.Int(required=True)    
    amen_name = fields.Str(required=True)
    amen_alias = fields.Str(required=True)
    yelp_id = fields.Str(required=True)
    rating = fields.Float(required=False)
    num_review = fields.Int(required=False)  
    address = fields.Str(required=True)
    city = fields.Str(required=True)
    state = fields.Str(required=True)
    zip_code = fields.Str(required=True)
    longitude = fields.Float(required=True)
    latitude = fields.Float(required=True)
    pricing = fields.Method('format_pricing')
    deliver = fields.Boolean(required=False)
    takeout = fields.Boolean(required=False)
    hours = fields.Method('format_hours')
    images = fields.List(fields.Nested(AmenitiesImagesSchema(only=['url'])))
    categories = fields.List(fields.Nested(AmenitiesCategoriesSchema(only=['category'])))
    reviews = fields.List(fields.Nested(AmenitiesReviewsSchema(only=['review_id', 'user_id', 'user_name'])))

    def format_pricing(self, amenity):
        if amenity.pricing == 'NaN':
            amenity.pricing = 'N/A'
        return amenity.pricing
    
    def format_hours(self, amenity):
        if amenity.hours == 'NaN':
            amenity.hours = 'N/A'
        return amenity.hours

amenities_schema = AmenitiesSchema()
all_amenities_schema = AmenitiesSchema(only=['amen_id', 'amen_name', 'pricing', 'city', 'state', 'num_review', 'deliver', 'takeout'], many=True)
=======
>>>>>>> Merge back-end into amenities-routing


class AmenitiesImagesSchema(ma.Schema):
    id = fields.Int(required=True)
    amen_id = fields.Int(required=True)
    url = fields.Str(required=True)


class AmenitiesReviewsSchema(ma.Schema):
    id = fields.Int(required=True)
    amen_id = fields.Int(required=True)
    review_id = fields.Str(required=True)
    user_id = fields.Str(required=True)
    user_name = fields.Str(required=True)


class AmenitiesCategoriesSchema(ma.Schema):
    id = fields.Int(required=True)
    amen_id = fields.Int(required=True)
    category = fields.Str(required=True)


class AmenitiesSchema(ma.Schema):
    amen_id = fields.Int(required=True)
    amen_name = fields.Str(required=True)
    amen_alias = fields.Str(required=True)
    yelp_id = fields.Str(required=True)
    rating = fields.Float(required=False)
    num_review = fields.Int(required=False)
    address = fields.Str(required=True)
    city = fields.Str(required=True)
    state = fields.Str(required=True)
    zip_code = fields.Str(required=True)
    longitude = fields.Float(required=True)
    latitude = fields.Float(required=True)
    pricing = fields.Method("format_pricing")
    deliver = fields.Boolean(required=False)
    takeout = fields.Boolean(required=False)
    hours = fields.Method("format_hours")
    images = fields.List(fields.Nested(AmenitiesImagesSchema(only=["url"])))
    categories = fields.List(
        fields.Nested(AmenitiesCategoriesSchema(only=["category"]))
    )
    reviews = fields.List(
        fields.Nested(
            AmenitiesReviewsSchema(only=["review_id", "user_id", "user_name"])
        )
    )
    housing_nearby = fields.List(fields.Dict(keys=fields.Str(), values=fields.Str()))
    universities_nearby = fields.List(fields.Dict(keys=fields.Str(), values=fields.Str()))


    def format_pricing(self, amenity):
        if amenity.pricing == "NaN":
            amenity.pricing = "N/A"
        return amenity.pricing

    def format_hours(self, amenity):
        if amenity.hours == "NaN":
            amenity.hours = "N/A"
        return amenity.hours


amenities_schema = AmenitiesSchema()
all_amenities_schema = AmenitiesSchema(
    only=[
        "amen_id",
        "amen_name",
        "pricing",
        "city",
        "state",
        "num_review",
        "deliver",
        "takeout",
    ],
    many=True,
)


@app.route("/")
def home():
    return "hello world"


@app.route("/amenities", methods=["GET"])
def amenities():
    amenities = Amenities.query.all()
    return all_amenities_schema.jsonify(amenities)


@app.route("/amenities/<int:amen_id>", methods=["GET"])
def amenities_id(amen_id):
    amenity = Amenities.query.get(amen_id)
    if amenity is None:
        response = flask.Response(
            json.dumps({"error": "id " + str(amen_id) + " not found"}),
            mimetype="application/json",
        )
        response.status_code = 404
        return response
    return amenities_schema.jsonify(amenity)


@app.route('/amenities', methods=['GET'])
def amenities():
    amenities = Amenities.query.all()
    return all_amenities_schema.jsonify(amenities)

@app.route('/amenities/<int:amen_id>', methods=['GET'])
def amenities_id(amen_id):
    amenity = Amenities.query.get(amen_id)
    if amenity is None:
        response = flask.Response(
            json.dumps({'error': 'id ' + str(amen_id) + ' not found'}), 
            mimetype='application/json'
        )
        response.status_code = 404
        return response
    return amenities_schema.jsonify(amenity)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
