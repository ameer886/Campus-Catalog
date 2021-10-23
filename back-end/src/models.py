from enum import unique
from flask import request
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, Sequence
from sqlalchemy.orm import relation
from sqlalchemy.sql.schema import ForeignKey, ForeignKeyConstraint
from marshmallow import fields


db = SQLAlchemy()
ma = Marshmallow()
class University(db.Model):
    __tablename__ = 'university'
    univ_id = db.Column(db.Integer, primary_key=True)
    univ_name = db.Column(db.String(255), nullable=False)
    alias = db.Column(db.String(256), nullable=True)
    rank = db.Column(db.Integer, nullable=True)
    city = db.Column(db.String(64), nullable=False)
    state = db.Column(db.String(2), nullable=False)
    zip_code = db.Column(db.String(32), nullable=True)
    school_url = db.Column(db.String(128), nullable=True)
    locale = db.Column(db.Integer, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    latitude = db.Column(db.Float, nullable=True)
    carnegie_undergrad = db.Column(db.Integer, nullable=True)
    num_undergrad = db.Column(db.Integer, nullable=True)
    num_graduate = db.Column(db.Integer, nullable=True)
    ownership_id = db.Column(db.String(128), nullable=False)
    mascot_name = db.Column(db.String(128), nullable=True)
    acceptance_rate = db.Column(db.Float, nullable=True)
    graduation_rate = db.Column(db.Float, nullable=True)
    tuition_in_st = db.Column(db.Integer, nullable=True)
    tuition_out_st = db.Column(db.Integer, nullable=True)
    avg_sat = db.Column(db.Float, nullable=True)
    avg_cost_attendance = db.Column(db.Float, nullable=True)
    
    def __repr__(self):
        return '<University %r>' %self.univ_name

    def __init__(self, univ_id = 0, univ_name = "NaN", alias = "NaN", rank = 0, city = "NaN", state = "N", zip_code = "NaN", school_url = "NaN", locale = 0, longitude = 0, latitude = 0, carnegie_undergrad = 0, num_undergrad = 0, num_graduate = 0, ownership_id = "NaN",
    mascot_name = "NaN", acceptance_rate = 0, graduation_rate = 0, tuition_in_st = 0, tuition_out_st = 0, avg_sat = 0, avg_cost_attendance = 0):
        self.univ_id = univ_id
        self.univ_name = univ_name
        self.alias = alias
        self.rank = rank
        self.city = city
        self.state = state
        self.zip_code = zip_code
        self.school_url = school_url
        self.locale = locale
        self.carnegie_undergrad = carnegie_undergrad
        self.num_undergrad = num_undergrad
        self.num_graduate = num_graduate
        self.ownership_id = ownership_id
        self.mascot_name = mascot_name
        self.acceptance_rate = acceptance_rate
        self.graduation_rate = graduation_rate
        self.tuition_in_st = tuition_in_st
        self.tuition_out_st = tuition_out_st
        self.avg_sat = avg_sat
        self.avg_cost_attendance = avg_cost_attendance
        self.longitude = longitude
        self.latitude = latitude

class UniversityImages(db.Model):
    __tablename__ = "universityImages"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    univ_id = db.Column(db.String, nullable=False)
    url = db.Column(db.String(256), nullable=False)

    def __init__(self, univ_id = 0, url = "NaN"):
        self.univ_id = univ_id
        self.url = url

class Housing(db.Model):
    __tablename__ = 'housing'
    property_id = db.Column(db.String, primary_key=True)
    property_name = db.Column(db.String, nullable=False)
    property_type = db.Column(db.String(32))
    address = db.Column(db.String, nullable=False)
    neighborhood = db.Column(db.String, nullable=False)
    city = db.Column(db.String(128), nullable=False)
    state = db.Column(db.String(2), nullable=False)
    zip_code = db.Column(db.String, nullable=False)
    rating = db.Column(db.Float, nullable=False)
    min_rent = db.Column(db.Integer, nullable=True)
    max_rent = db.Column(db.Integer, nullable=True)
    min_bed = db.Column(db.Integer, nullable=True)
    max_bed = db.Column(db.Integer, nullable=True)
    min_bath = db.Column(db.Integer, nullable=True)
    max_bath = db.Column(db.Integer, nullable=True)
    min_sqft = db.Column(db.Integer, nullable=True)
    max_sqft = db.Column(db.Integer, nullable=True)
    walk_score = db.Column(db.Integer, nullable=True)
    transit_score = db.Column(db.Integer, nullable=True)
    dog_allow = db.Column(db.Boolean)
    cat_allow = db.Column(db.Boolean)
    max_num_dog = db.Column(db.Integer, nullable=True)
    max_num_cat = db.Column(db.Integer, nullable=True)
    dog_weight = db.Column(db.Integer, nullable=True)
    cat_weight = db.Column(db.Integer, nullable=True)
    building_amenities = db.Column(db.String, nullable=True)
    util_included = db.Column(db.String, nullable=True)

    def __repr__(self):
        return '<Housing %r>' %self.property_name

    def __init__(self, property_id = '', property_name = "NaN", property_type = "NaN", address = "NaN", neighborhood = "NaN", city = "NaN", state = "N", zip_code = "NaN", 
    rating = 0.0, min_rent = 0, max_rent = None, min_bed = None, max_bed = None, min_bath = None, max_bath = None, min_sqft = None, max_sqft = None, walk_score = 0, transit_score = 0,
    dog_allow = False, cat_allow = False, max_num_dog = None, max_num_cat = None, dog_weight = None, cat_weight = None, building_amenities = "NaN", util_included = "NaN",
    amenities_nearby = None, universities_nearby = None, image_id = None, images = None):
        self.property_id = property_id
        self.property_name = property_name
        self.property_type = property_type
        self.address = address
        self.neighborhood = neighborhood
        self.city = city
        self.state = state
        self.zip_code = zip_code
        self.rating = rating
        self.walk_score = walk_score
        self.transit_score = transit_score
        self.min_rent = min_rent
        self.max_rent = max_rent
        self.min_bed = min_bed
        self.max_bed = max_bed
        self.min_bath = min_bath
        self.max_bath = max_bath
        self.min_sqft = min_sqft
        self.max_sqft = max_sqft
        self.dog_allow = dog_allow
        self.cat_allow = cat_allow
        self.max_num_dog = max_num_dog
        self.max_num_cat = max_num_cat
        self.dog_weight = dog_weight
        self.cat_weight = cat_weight
        self.building_amenities = building_amenities
        self.util_included = util_included
        self.amenities_nearby = amenities_nearby
        self.universities_nearby = universities_nearby
        self.image_id = image_id
        self.images = images
        if self.max_rent is None and self.min_rent is not None:
            self.max_rent = self.min_rent
        if self.dog_allow == False:
            self.max_num_dog = 0
            self.dog_weight = None
        if self.cat_allow == False:
            self.max_num_cat = 0
            self.cat_weight = None
    
    @classmethod
    def build_obj_from_args(cls, args):
        columns = ('property_id', 'property_name', 'property_type', 'address', 'neighborhood', 'city', 'state',
                'zip_code', 'min_rent', 'max_rent', 'min_bed', 'max_bed', 'min_bath', 'max_bath', 'min_sqft',
                'max_sqft', 'dog_allow', 'cat_allow', 'max_num_dog', 'max_num_cat', 'dog_weight', 'cat_weight',
                'rating', 'building_amenities', 'walk_score', 'transit_score', 'util_included', 'image_id', 'images')
        kwargs = dict(zip(columns,args))
        kwargs['util_included'] = kwargs['util_included'].split(',') if kwargs['util_included'] is not None else None
        kwargs['building_amenities'] = kwargs['building_amenities'].split(',') if kwargs['building_amenities'] is not None else None
        kwargs['images'] = kwargs['images'].split('@@@')
        return cls(**kwargs)

    def set_amen_nearby(self, args):
        self.amenities_nearby = []
        for x, y in args:
            amen = {'amenity_id': x, 'amenity_name': y}
            self.amenities_nearby.append(amen)
    
    def set_univ_nearby(self, args):
        self.universities_nearby = []
        for x, y in args:
            univ = {'university_id': x, 'university_name': y}
            self.universities_nearby.append(univ)

    def get_id(self):
        return str(self.property_id)
    
    def get_type(self):
        return str(self.property_type)

class HousingImages(db.Model):
    __tablename__ = 'housingImages'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    property_id = db.Column(db.String, nullable=False)
    property_type = db.Column(db.String(32), nullable=False)
    image_url = db.Column(db.String)
    __table_args__ = (ForeignKeyConstraint(['property_id', 'property_type'],['housing.property_id', 'housing.property_type']),)

    def __init__(self, property_id = 0, property_type = '', image_url = ''):
        self.property_id = property_id
        self.property_type = property_type
        self.image_url = image_url

class Amenities(db.Model):
    __tablename__ = 'amenities'
    amen_id = db.Column(db.Integer, unique=True, primary_key=True)
    amen_name = db.Column(db.String(128), nullable=False)
    amen_alias = db.Column(db.String(128), nullable=False)
    yelp_id = db.Column(db.String(128), unique=True, nullable=False)
    rating = db.Column(db.Float, nullable=False)
    num_review = db.Column(db.Integer)
    address = db.Column(db.String(128), nullable=False)
    city = db.Column(db.String(128), nullable=False)
    state = db.Column(db.String(2), nullable=False)
    zip_code = db.Column(db.String(16), nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    pricing = db.Column(db.String(8))
    deliver = db.Column(db.Boolean, nullable=False)
    takeout = db.Column(db.Boolean, nullable=False)
    hours = db.Column(db.String(512), nullable=False)
    images = db.relationship('AmenitiesImages', cascade='all, delete-orphan', passive_deletes=True)
    categories = db.relationship('AmenitiesCategories', cascade='all, delete-orphan', passive_deletes=True)
    reviews = db.relationship('AmenitiesReviews', cascade='all, delete-orphan', passive_deletes=True)

    def __repr__(self):
        return '<Amenity %r>' %self.amen_name

    def __init__(self, amen_id = 0, amen_name = "NaN", amen_alias = "NaN", yelp_id = "NaN", rating = 0, num_review = 0, address = "NaN", city = "NaN", state = "N", zip_code = "NaN", longitude = 0,
    latitude = 0, pricing = "NaN", deliver = None, takeout = None, hours = "NaN"):
        self.amen_id = amen_id
        self.amen_name = amen_name
        self.amen_alias = amen_alias
        self.yelp_id = yelp_id
        self.rating = rating
        self.num_review = num_review
        self.address = address
        self.city = city
        self.state = state
        self.zip_code = zip_code
        self.longitude = longitude
        self.latitude = latitude
        self.pricing = pricing
        self.deliver = deliver
        self.takeout = takeout
        self.hours = hours

class AmenitiesImages(db.Model):
    __tablename__ = "amenitiesImages"
    id = db.Column(db.Integer, primary_key=True)
    amen_id = db.Column(db.Integer, ForeignKey("amenities.amen_id"))
    url = db.Column(db.String(256), nullable=False)

    def __init__(self, id = 0, amen_id = 0, url = "NaN"):
        self.id = id
        self.amen_id = amen_id
        self.url = url

class AmenitiesCategories(db.Model):
    __tablename__ = "amenitiesCategories"
    id = db.Column(db.Integer, primary_key=True)
    amen_id = db.Column(db.Integer, ForeignKey("amenities.amen_id"))
    category = db.Column(db.String(128), nullable=False)
    
    def __init__(self, id = 0, amen_id = 0, category = "NaN"):
        self.id = id
        self.amen_id = amen_id
        self.category = category

class AmenitiesReviews(db.Model):
    __tablename__ = "amenitiesReviews"
    id = db.Column(db.Integer, primary_key=True)
    amen_id = db.Column(db.Integer, ForeignKey("amenities.amen_id"))
    review_id = db.Column(db.String(128), nullable=False)
    user_id = db.Column(db.String(128), nullable=False)
    user_name = db.Column(db.String(128), nullable=False)

    def __init__(self, id = 0, amen_id = 0, review_id = "NaN", user_id = "NaN", user_name = "NaN"):
        self.id = id
        self.amen_id = amen_id
        self.review_id = review_id
        self.user_id = user_id
        self.user_name = user_name   