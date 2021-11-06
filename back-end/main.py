from os import abort
import flask
import json
from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from db import db_init
from sqlalchemy import text, desc
from sqlalchemy.sql.schema import MetaData, Column
from models import University, Housing, Amenities
from flask_marshmallow import Marshmallow
from marshmallow import fields, validate
import queries

app = Flask(__name__)
CORS(app)
db = db_init(app)
ma = Marshmallow(app)

metadata = MetaData(db.engine)
metadata.reflect()
university = metadata.tables["university"]
housing = metadata.tables["housing"]
housingImages = metadata.tables["housingImages"]


@app.route("/")
def home():
    return "<h1> goodbye world </h1>"


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
    class Meta:
        ordered = True

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
        "rating",
    ],
    many=True,
)


class HousingSchema(ma.Schema):
    class Meta:
        ordered = True

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
        return {
            "street address": property.address,
            "neighborhood": property.neighborhood,
            "city": property.city,
            "state": property.state,
            "zipcode": property.zip_code,
            "lat": property.lat,
            "lon": property.lon,
        }


exclude_columns = (
    "address",
    "city",
    "state",
    "min_sqft",
    "max_sqft",
    "neighborhood",
    "lat",
    "lon",
)
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

def normalize_query(params):
    unflat_params = params.to_dict()
    return {k: v for k, v in unflat_params.items() if k in table_columns}

@app.route("/housing", methods=["GET"])
def get_all_housing():

    # retrieve params
    page = request.args.get('page', default=1, type=int)
    per_page = request.args.get('per_page', default=10, type=int)
    sort_column = request.args.get('sort', default='state', type=str).lower()
    sort_desc = request.args.get('desc', default=False, type=lambda v: v.lower() == 'true')

    # retrieve params for filtering
    type_filter = request.args.getlist('type')

    type_list = type_filter[0].split(',') if len(type_filter) > 0 else type_filter
    
    # positional filters
    filter_params = normalize_query(request.args)
    filter_on = bool(filter_params)

    # verify param validity
    if page < 1:
        abort(400, "invalid paramter: page must be greater than 0")
    if per_page < 1:
        abort(400, "invalid paramter: per_page must be greater than 0")
    if sort_column not in housing.c:
        abort(400, f"invalid paramter: column {sort_column} not in table")
    if sort_column not in table_columns:
        abort(400, f"invalid paramter: column {sort_column.capitalize()} not in {table_columns}")
    
    # query and paginate
    try:
        # get Query object
        sql_query = Housing.query

        # apply filters if detected
        if len(type_filter) > 0:
            sql_query = sql_query.filter(getattr(Housing, 'property_type').in_(type_list)) 
        if filter_on:
            sql_query = sql_query.filter_by(**filter_params)
        
        order = desc(text(sort_column)) if sort_desc == True else text(sort_column)
        paginated_response = sql_query.order_by(order).paginate(page, max_per_page=per_page)
        all_housing = paginated_response.items
    except Exception as e:
        err = flask.Response(
            json.dumps({"error": f"{e}, {page} not found"}), 404, mimetype="application/json"
        )
        return err

    page_headers = {"page": page, 
                    "per_page": paginated_response.per_page,
                    "max_page": paginated_response.pages,
                    "total_items": paginated_response.total}

    result = all_housing_schema.dump(all_housing)
    return jsonify(page_headers, {"properties": result})


@app.route("/housing/<string:id>", methods=["GET"])
def get_housing_by_id(id):
    sql = queries.query_images(id)
    result = db.session.execute(sql)
    if result.rowcount == 0:
        err = flask.Response(
            json.dumps({"error": id + " not found"}), 404, mimetype="application/json"
        )
        return err
    housing = Housing.build_obj_from_args(*result)
    amen_sql = queries.query_amen(id)
    amen_nearby = db.session.execute(amen_sql)
    univ_sql = queries.query_univ(id)
    univ_nearby = db.session.execute(univ_sql)
    result.close()
    amenities = tuple(amen_nearby)
    universities = tuple(univ_nearby)
    housing.set_amen_nearby(amenities)
    housing.set_univ_nearby(universities)
    return jsonify(single_housing_schema.dump(housing))


class UniversitySchema(ma.Schema):
    class Meta:
        ordered = True

    univ_id = fields.Str(required=True)
    univ_name = fields.Str(required=True)
    alias = fields.Str()
    location = fields.Method("format_location")
    city = fields.Str(required=True)
    state = fields.Str(required=True)
    rank = fields.Int()
    zip_code = fields.Str()
    school_url = fields.Str()
    locale = fields.Method("map_locale")
    longitude = fields.Float(missing=0.0)
    latitude = fields.Float(missing=0.0)
    carnegie_undergrad = fields.Method("map_carnegie")
    num_undergrad = fields.Int()
    num_graduate = fields.Int()
    ownership_id = fields.Method("map_ownership")
    acceptance_rate = fields.Float(missing=0.0)
    graduation_rate = fields.Float(missing=0.0)
    tuition_in_st = fields.Int()
    tuition_out_st = fields.Int()
    avg_sat = fields.Float(missing=0.0)
    avg_cost_attendance = fields.Float(missing=0.0)
    amenities_nearby = fields.List(fields.Dict(keys=fields.Str(), values=fields.Str()))
    housing_nearby = fields.List(fields.Dict(keys=fields.Str(), values=fields.Str()))
    image = fields.Url()

    def map_ownership(self, univ):
        num = univ.ownership_id
        if num == 1:
            return "Public"
        elif num == 2:
            return "Private Non-Profit"
        elif num == 3:
            return "Private For-Profit"
        else:
            return "Unknown"

    def map_carnegie(self, univ):
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
            return "Four-year, medium full-time, inclusive, higher transfer-in"
        if num == 8:
            return "Four-year, medium full-time, selective, lower transfer-in"
        if num == 9:
            return "Four-year, medium full-time, selective, higher transfer-in"
        if num == 10:
            return "Four year, full-time, inclusive, lower transfer-in"
        if num == 11:
            return "Four-year, full-time, inclusive, higher transfer-in"
        if num == 12:
            return "Four-year, full-time, selective, lower transfer-in"
        if num == 13:
            return "Four-year, full-time, selective, higher transfer-in"
        if num == 14:
            return "Four-year, full-time, more selective, lower transfer-in"
        if num == 15:
            return "Four year, full-time, more selective, higher transfer-in"

    def map_locale(self, univ):
        num = univ.locale if univ.locale is not None else 0
        dist = num % 10
        size = num // 10
        ret = ""
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
        return {
            "city": university.city,
            "state": university.state,
            "zipcode": university.zip_code,
        }


exclude_columns = ("city", "state")
single_univ_schema = UniversitySchema(exclude=exclude_columns)

univ_columns = (
    "univ_id",
    "univ_name",
    "rank",
    "city",
    "state",
    "ownership_id",
    "acceptance_rate",
    "tuition_in_st",
    "tuition_out_st",
    "avg_cost_attendance",
    "image",
)
all_univ_schema = UniversitySchema(only=univ_columns, many=True)


@app.route("/universities", methods=["GET"])
def get_all_universities():

    page = request.args.get('page', default=1, type=int)
    per_page = request.args.get('per_page', default=10, type=int)

    if page < 1:
        abort(400, "invalid paramter: page must be greater than 0")
    if per_page < 1:
        abort(400, "invalid paramter: per_page must be greater than 0")
    
    try:
        paginated_response = University.query.paginate(page, max_per_page=per_page)
        all_univ = paginated_response.items
    except Exception:
        err = flask.Response(
            json.dumps({"error": f"{page} not found"}), 404, mimetype="application/json"
        )
        return err

    page_headers = {"page": page, 
                    "per_page": paginated_response.per_page,
                    "max_page": paginated_response.pages,
                    "total_items": paginated_response.total}
    result = all_univ_schema.dump(all_univ)
    return jsonify(page_headers, {"universities": result})


@app.route("/universities/<string:id>", methods=["GET"])
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
            json.dump({"error": id + " not found"}), mimetype="application/json"
        )
        err.status_code = 404
        return err
    return jsonify(single_univ_schema.dump(univ))


@app.route("/amenities", methods=["GET"])
def amenities():
    page = request.args.get('page', default=1, type=int)
    per_page = request.args.get('per_page', default=10, type=int)

    if page < 1:
        abort(400, "invalid paramter: page must be greater than 0")
    if per_page < 1:
        abort(400, "invalid paramter: per_page must be greater than 0")
    
    # query and paginate
    try:
        paginated_response = Amenities.query.paginate(page, max_per_page=per_page)
        all_amenities = paginated_response.items
    except Exception:
        err = flask.Response(
            json.dumps({"error": f"{page} not found"}), 404, mimetype="application/json"
        )
        return err

    page_headers = {"page": page, 
                    "per_page": paginated_response.per_page,
                    "max_page": paginated_response.pages,
                    "total_items": paginated_response.total}

    result = all_amenities_schema.dump(all_amenities)
    return jsonify(page_headers, {"amenities": result})


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
    amenity = amenities_schema.dump(amenity)
    images = []
    categories = []
    for image in amenity["images"]:
        images.append(image["url"])
    for category in amenity["categories"]:
        categories.append(category["category"])
    amenity["images"] = images
    amenity["categories"] = categories
    return jsonify(amenity)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
