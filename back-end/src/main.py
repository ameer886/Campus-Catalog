import flask
import json
from flask import Flask, jsonify, request
from flask.templating import render_template
from db import db_init
from models import University, Housing, Amenities
from flask_marshmallow import Marshmallow
from marshmallow import fields, validate
import queries

app = Flask(__name__)
db = db_init(app)
ma = Marshmallow(app)


@app.route("/")
def home():
    return "<h1> hello world </h1>"


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
    universities_nearby = fields.List(
        fields.Dict(keys=fields.Str(), values=fields.Str())
    )

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


class HousingSchema(ma.Schema):

    property_id = fields.Str(required=True)
    property_name = fields.Str(required=True)
    property_type = fields.Str(
        required=True,
        validate=validate.OneOf(["apartment", "condo", "house", "townhome"]),
    )
    location = fields.Method("format_location")
    address = fields.Str(required=True)
    neighborhood = fields.Str(required=True)
    city = fields.Str(required=True)
    state = fields.Str(required=True)
    lat = fields.Decimal(required=True)
    lon = fields.Decimal(required=True)
    rating = fields.Float(missing=0.0)
    walk_score = fields.Int()
    transit_score = fields.Int()
    min_rent = fields.Int(required=True)
    max_rent = fields.Int()
    bed = fields.Method("format_bedroom")
    bath = fields.Method("format_bathroom")
    min_sqft = fields.Float()
    max_sqft = fields.Float()
    sqft = fields.Method("format_space")
    dog_allow = fields.Boolean()
    max_num_dog = fields.Int()
    dog_weight = fields.Int()
    cat_allow = fields.Boolean()
    max_num_cat = fields.Int()
    cat_weight = fields.Int()
    images = fields.List(fields.Url)
    util_included = fields.List(fields.Str())
    building_amenities = fields.List(fields.Str())
    amenities_nearby = fields.List(fields.Dict(keys=fields.Str(), values=fields.Str()))
    universities_nearby = fields.List(
        fields.Dict(keys=fields.Str(), values=fields.Str())
    )

    def format_bedroom(self, property):
        if property.max_bed is None:
            property.max_bed = property.min_bed
        return {"min": property.min_bed, "max": property.max_bed}

    def format_bathroom(self, property):
        if property.max_bath is None:
            property.max_bath = property.min_bath
        return {"min": property.min_bath, "max": property.max_bath}

    def format_space(self, property):
        return {"min": property.min_sqft, "max": property.max_sqft}

    def format_location(self, property):
        return {'street address': property.address,
                'neighborhood': property.neighborhood,
                'city': property.city,
                'state': property.state,
                'zipcode': property.zip_code,
                'lat': property.lat,
                'lon': property.lon}

exclude_columns = ('address', 'city', 'state', 'min_sqft', 'max_sqft', 'neighborhood', 'lat', 'lon')
single_housing_schema = HousingSchema(exclude=exclude_columns)

# table view
table_columns = (
    "property_name",
    "property_id",
    "property_type",
    "city",
    "state",
    "rating",
    "walk_score",
    "transit_score",
    "max_rent",
    "max_sqft",
)
all_housing_schema = HousingSchema(only=table_columns, many=True)


@app.route("/housing", methods=["GET"])
def get_all_housing():
    all_housing = Housing.query.all()
    result = all_housing_schema.dump(all_housing)
    return jsonify({"properties": result})


@app.route("/housing/<string:id>", methods=["GET"])
def get_housing_by_id(id):
    sql = queries.query_images(id)
    result = db.session.execute(sql)
    housing = Housing.build_obj_from_args(*result)
    amen_sql = queries.query_amen(id)
    amen_nearby = db.session.execute(amen_sql)
    univ_sql = queries.query_univ(id)
    univ_nearby = db.session.execute(univ_sql)
    amenities = tuple(amen_nearby)
    universities = tuple(univ_nearby)
    housing.set_amen_nearby(amenities)
    housing.set_univ_nearby(universities)
    if housing is None:
        err = flask.Response(
            json.dump({"error": id + " not found"}), mimetype="application/json"
        )
        err.status_code = 404
        return err
    return jsonify(single_housing_schema.dump(housing))


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
    housing_sql = queries.query_housing_from_amen(amen_id)
    housing_nearby = db.session.execute(housing_sql)
    univ_sql = queries.query_univ_from_amen(amen_id)
    univ_nearby = db.session.execute(univ_sql)
    housing = tuple(housing_nearby)
    universities = tuple(univ_nearby)
    amenity.set_housing_nearby(housing)
    amenity.set_univ_nearby(universities)
    return amenities_schema.jsonify(amenity)
class UniversitySchema(ma.Schema):

    univ_id = fields.Str(required=True)
    univ_name = fields.Str(required=True)
    alias = fields.Str()
    location = fields.Method('format_location')
    city = fields.Str(required=True)
    state = fields.Str(required=True)
    rank = fields.Int()
    zip_code = fields.Str()
    school_url = fields.Str()
    locale = fields.Method('map_locale')
    longitude = fields.Float(missing=0.0)
    latitude = fields.Float(missing=0.0)
    carnegie_undergrad = fields.Method('map_carnegie')
    num_undergrad = fields.Int()
    num_graduate = fields.Int()
    ownership_id = fields.Method('map_ownership')
    mascot_name = fields.Str()
    acceptance_rate = fields.Float(missing=0.0)
    graduation_rate = fields.Float(missing=0.0)
    tuition_in_st = fields.Int()
    tuition_out_st = fields.Int()
    avg_sat = fields.Float(missing=0.0)
    avg_cost_attendance = fields.Float(missing=0.0)
    amenities_nearby = fields.List(fields.Dict(keys=fields.Str(), values=fields.Str()))
    universities_nearby = fields.List(fields.Dict(keys=fields.Str(), values=fields.Str()))
    image = fields.Url()

    def map_ownership (self, univ):
        num = univ.ownership_id
        if num == 1:
            return "Public"
        elif num == 2:
            return "Private Non-Profit"
        elif num == 3:
            return "Private For-Profit"
        else:
            return "Unknown"

    def map_carnegie (self, univ):
        num = univ.carnegie_undergrad
        if num == -2:
            return
        if num == 0:
            return "Not Classified"
        if num == 1:
            return "Two-year, higher part time"
        if num == 2:
            return "Two-year, mixed part/full-time"
        if num == 3:
            return "Two-year, medium full-time"
        if num == 4:
            return "Two-year, higher full-time"
        if num == 5:
            return "Four-year, higher part-time"
        if num == 6:
            return "Four year, medium full-time, inclusive, lower transfer-in"
        if num == 7:
            return  "Four-year, medium full-time, inclusive, higher transfer-in"
        if num == 8:
            return "Four-year, medium full-time, selective, lower transfer-in"
        if num == 9:
            return "Four-year, medium full-time, selective, higher transfer-in"
        if num == 10:
            return "Four year, full-time, inclusive, lower transfer-in"
        if num == 11:
            return  "Four-year, full-time, inclusive, higher transfer-in"
        if num == 12:
            return "Four-year, full-time, selective, lower transfer-in"
        if num == 13:
            return "Four-year, full-time, selective, higher transfer-in"
        if num == 14:
            return "Four-year, full-time, more selective, lower transfer-in"
        if num == 15:
            return "Four year, full-time, more selective, higher transfer-in"

    def map_locale (self, univ):
        num = univ.locale if univ.locale is not None else 0
        dist = num % 10
        size = num // 10
        ret = ''
        if size == 1:
            ret += "City: "
        elif size == 2:
            ret += "Suburb: "
        elif size == 3:
            ret += "Town: "
        elif size == 4:
            ret += "Rural: "

        if dist == 1:
            if size >= 3:
                ret += "Fringe"
            else:
                ret += "Large"
        elif dist == 2:
            if size >= 3:
                ret += "Distant"
            else:
                ret += "Midsize"
        elif dist == 3:
            if size >= 3:
                ret += "Remote"
            else:
                ret += "Small"
        return ret

    def format_location(self, university):
        return {'city': university.city,
                'state': university.state,
                'zipcode': university.zip_code}

exclude_columns = ('city', 'state', 'mascot_name')
single_univ_schema = UniversitySchema(exclude=exclude_columns)

univ_columns = ('univ_id', 'univ_name', 'alias', 'rank', 'city', 'state',
                'zip_code', 'school_url', 'locale', 'carnegie_undergrad', 'num_undergrad', 'num_graduate', 'ownership_id',
                'mascot_name', 'acceptance_rate', 'graduation_rate', 'tuition_in_st', 'tuition_out_st', 'avg_sat', 'avg_cost_attendance',
                'longitude', 'latitude', 'image')
all_univ_schema = UniversitySchema(only=univ_columns, many=True)

@app.route('/universities', methods=['GET'])
def get_all_universities():
    all_univ = University.query.all()
    result = all_univ_schema.dump(all_univ)
    return jsonify({'properties': result})


@app.route('/universities/<string:id>', methods=['GET'])
def get_univ_by_id(id):
    sql = queries.query_univ_images(id)
    result = db.session.execute(sql)
    univ = University.build_univ_from_args(*result)
    amen_sql = queries.query_univ_amen(id)
    amen_nearby = db.session.execute(amen_sql)
    hous_sql = queries.query_univ_housing(id)
    hous_nearby = db.session.execute(hous_sql)
    amenities = tuple(amen_nearby)
    housing = tuple(hous_nearby)
    univ.set_amen_nearby(amenities)
    univ.set_housing_nearby(housing)
    if univ is None:
        err = flask.Response(
            json.dump({'error': id + ' not found'}),
            mimetype='application/json'
        )
        err.status_code = 404
        return err
    return jsonify(single_univ_schema.dump(univ))


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
