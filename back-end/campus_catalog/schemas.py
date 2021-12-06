from marshmallow import fields, validate
from flask_marshmallow import Marshmallow

ma = Marshmallow()


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
    rating = fields.Float(load_default=0.0)
    walk_score = fields.Int()
    transit_score = fields.Int()
    min_rent = fields.Int(required=True)
    max_rent = fields.Int()
    rent = fields.Method("format_rent")
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

    def format_rent(self, property):
        return {"min": property.min_rent, "max": property.max_rent}

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


class DataSummarySchema(ma.Schema):
    class Meta:
        ordered = True

    num_univ = fields.Int()
    num_amen = fields.Int()
    num_prop = fields.Int()
    state = fields.String()


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
    longitude = fields.Float(load_default=0.0)
    latitude = fields.Float(load_default=0.0)
    carnegie_undergrad = fields.Method("map_carnegie")
    num_undergrad = fields.Int()
    num_graduate = fields.Int()
    ownership_id = fields.Method("map_ownership")
    mascot_name = fields.Str()
    acceptance_rate = fields.Float(load_default=0.0)
    graduation_rate = fields.Float(load_default=0.0)
    tuition_in_st = fields.Int()
    tuition_out_st = fields.Int()
    avg_sat = fields.Float(load_default=0.0)
    avg_cost_attendance = fields.Float(load_default=0.0)
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


amenities_schema = AmenitiesSchema()
amenities_table_columns = (
    "amen_id",
    "amen_name",
    "pricing",
    "city",
    "state",
    "num_review",
    "deliver",
    "takeout",
    "rating",
)
all_amenities_schema = AmenitiesSchema(only=amenities_table_columns, many=True)


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
    "rent",
    "bed",
)
all_housing_schema = HousingSchema(only=table_columns, many=True)

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
    "graduation_rate",
    "tuition_in_st",
    "tuition_out_st",
    "avg_cost_attendance",
)
all_univ_schema = UniversitySchema(only=univ_columns, many=True)

data_summary_schema = DataSummarySchema(many=True)
