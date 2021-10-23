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

@app.route('/')
def home():
    return '<h1> hello world </h1>'

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
    max_rent = fields.Int()
    bed = fields.Method('format_bedroom')
    bath = fields.Method('format_bathroom')
    min_sqft = fields.Float()
    max_sqft = fields.Float()
    sqft = fields.Method('format_space')
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
    universities_nearby = fields.List(fields.Dict(keys=fields.Str(), values=fields.Str()))

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
        return {'street address': property.address,
                'neighborhood': property.neighborhood,
                'city': property.city,
                'state': property.state,
                'zipcode': property.zip_code}

exclude_columns = ('address', 'city', 'state', 'min_sqft', 'max_sqft')
single_housing_schema = HousingSchema(exclude=exclude_columns)

# table view 
table_columns = ('property_name','property_id', 'property_type', 'city', 'state', 'rating', 'walk_score', 'transit_score', 'max_rent', 'max_sqft')
all_housing_schema = HousingSchema(only=table_columns, many=True)

@app.route('/housing', methods=['GET'])
def get_all_housing():
    all_housing = Housing.query.all()
    result = all_housing_schema.dump(all_housing)
    return jsonify({'properties': result})

@app.route('/housing/<string:id>', methods=['GET'])
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
            json.dump({'error': id + ' not found'}),
            mimetype='application/json'
        )
        err.status_code = 404
        return err
    return jsonify(single_housing_schema.dump(housing))

class UniversitySchema(ma.Schema):

    univ_id = fields.Str(required=True)
    univ_name = fields.Str(required=True)
    alias = fields.Str()
    location = fields.Method('format_location')
    city = fields.Str(required=True)
    state = fields.Str(required=True)
    rank = fields.Float(missing=0.0)
    zip_code = fields.Str()
    school_url = fields.Str()
    locale = fields.Int()
    longitude = fields.Float(missing=0.0)
    latitude = fields.Float(missing=0.0)
    carnegie_undergrad = fields.Int()
    num_undergrad = fields.Int()
    num_graduate = fields.Int()
    ownership_id = fields.Str()
    mascot_name = fields.Str()
    acceptance_rate = fields.Float(missing=0.0)
    graduation_rate = fields.Float(missing=0.0)
    tuition_in_st = fields.Int()
    tuition_out_st = fields.Int()
    avg_sat = fields.Float(missing=0.0)
    avg_cost_attendance = fields.Float(missing=0.0)


    def format_location(self, property):
        return {'city': property.city,
                'state': property.state,
                'zipcode': property.zip_code}

exclude_columns = ('city', 'state', 'mascot_name', 'carnegie_undergrad')
single_univ_schema = UniversitySchema(exclude=exclude_columns)

univ_columns = ('univ_id', 'univ_name', 'alias', 'rank', 'city', 'state',
                'zip_code', 'school_url', 'locale', 'carnegie_undergrad', 'num_undergrad', 'num_graduate', 'ownership_id',
                'mascot_name', 'acceptance_rate', 'graduation_rate', 'tuition_in_st', 'tuition_out_st', 'avg_sat', 'avg_cost_attendance',
                'longitude', 'latitude')
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
    univ = University.build_obj_from_args(*result)
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