import re
from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql.sqltypes import VARCHAR
from sqlalchemy import text, desc, cast, or_
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.sql.schema import MetaData
from werkzeug.exceptions import HTTPException
from models import University, Housing, Amenities
import sqlalchemy

from schemas import (AmenitiesSchema, HousingSchema, UniversitySchema, table_columns, all_amenities_schema, amenities_schema, all_housing_schema, single_housing_schema, single_univ_schema, all_univ_schema, amenities_table_columns, univ_columns)
from exceptions import InvalidParamterException, HousingNotFound, AmenityNotFound, UniversityNotFound
import queries
from db import db_init

app = Flask(__name__)
CORS(app)
db = db_init(app)

metadata = MetaData(db.engine)
metadata.reflect()
university = metadata.tables["university"]
housing = metadata.tables["housing"]
amenities = metadata.tables["amenities"]

@app.route("/")
def home():
    return "<h1> goodbye world </h1>"

@app.route("/search", methods=["GET"])
def search():
    models = request.args.get(
        "models",
        default=["Housing", "Amenities", "University"],
        type=lambda v: v.split(","),
    )
    models = [model.capitalize() for model in models]
    query_terms = request.args.get("q", default=[], type=lambda v: v.split(" "))
    # pagination params

    housing_page = request.args.get("housing_page", default=1, type=int)
    housing_per_page = request.args.get("housing_per_page", default=10, type=int)
    housing = {}
    housing_pagination_header = {}
    if "Housing" in models:
        paginated_response = search_housing(query_terms).paginate(
            housing_page, error_out=False, max_per_page=housing_per_page
        )
        housing = {"properties": all_housing_schema.dump(paginated_response.items)}
        housing_pagination_header = {
            "housing_page": housing_page,
            "per_page": housing_per_page,
            "max_page": paginated_response.pages,
            "total_items": paginated_response.total,
        }

    amenities_page = request.args.get("amenities_page", default=1, type=int)
    amenities_per_page = request.args.get("amenities_per_page", default=10, type=int)
    amenities = {}
    amenities_pagination_header = {}
    if "Amenities" in models:
        amenities_query = search_amenities(query_terms)
        amenities_paginated_response = amenities_query.paginate(
            amenities_page, error_out=False, max_per_page=amenities_per_page
        )
        amenities = {
            "amenities": all_amenities_schema.dump(amenities_paginated_response.items)
        }
        amenities_pagination_header = {
            "amenities_page": amenities_page,
            "per_page": amenities_per_page,
            "max_page": amenities_paginated_response.pages,
            "total_items": amenities_paginated_response.total,
        }

    universities_page = request.args.get("universities_page", default=1, type=int)
    universities_per_page = request.args.get(
        "universities_per_page", default=10, type=int
    )
    universities = {}
    univ_pagination_header = {}
    if "University" in models:
        univ_paginated_response = search_universities(query_terms).paginate(
            universities_page, error_out=False, max_per_page=universities_per_page
        )
        universities = {
            "universities": all_univ_schema.dump(univ_paginated_response.items)
        }
        univ_pagination_header = {
            "universities_page": universities_page,
            "per_page": universities_per_page,
            "max_page": univ_paginated_response.pages,
            "total_items": univ_paginated_response.total,
        }

    return jsonify(
        {**amenities_pagination_header, **amenities},
        {**housing_pagination_header, **housing},
        {**univ_pagination_header, **universities},
    )


def search_housing(query_terms):
    sql = Housing.query
    for term in query_terms:
        sql = sql.filter(
            Housing.property_name.ilike(f"%{term}%")
            | Housing.property_type.match(term)
            | Housing.city.ilike(term)
            | Housing.state.ilike(term)
            | cast(Housing.walk_score, VARCHAR).ilike(f"{term}")
            | cast(Housing.transit_score, VARCHAR).ilike(f"{term}")
            | cast(Housing.max_bed, VARCHAR).ilike(term)
            | cast(Housing.min_bed, VARCHAR).ilike(term)
            | cast(Housing.max_rent, VARCHAR).ilike(term)
            | cast(Housing.min_rent, VARCHAR).ilike(term)
        )

    return sql


def merge_ranges(scores):
    score_dict = {
        0: (0, 100),
        1: (90, 100),
        2: (70, 89),
        3: (50, 69),
        4: (25, 49),
        5: (0, 24),
    }
    result = []
    if 0 in scores:
        result.append(score_dict[0])
        return result
    scores = sorted(scores)
    stack = []
    stack.append(score_dict[scores[0]])
    for i in range(1, len(scores)):
        if score_dict[scores[i]][1] == stack[0][0] - 1:
            stack.append((score_dict[scores[i]][0], stack.pop()[1]))
        else:
            result.append(stack.pop())
            stack.append(score_dict[scores[i]])
    result.append(stack.pop())
    return result


def normalize_query(params, columns):
    unflat_params = params.to_dict()
    return {k: v for k, v in unflat_params.items() if k in columns}

def json_field_handler(request, columns):
    fields = request.args.get("fields", type=lambda v: v.split(','))
    if fields is None:
        return fields
    difference = set(fields) - set(columns)
    if difference is not None:
        raise InvalidParamterException(description=f"Invalid Fields: {difference}\n Please select from {set(columns)}")
    return fields

def paginated_JSON_builder(data, schema, keyword):
    header = {"page": data.page,
            "per_page": data.per_page,
            "max_page": data.pages,
            "total_items": data.total}
    content = schema.dump(data.items)
    return jsonify(header, {keyword: content})

def paginated_query_result_builder(request, query, table):
    page, per_page = get_pagination_params(request)
    column, descending = get_sort_params(request, table)
    order = desc(text(column)) if descending == True else text(column)
    paginated_result = query.order_by(order).paginate(
        page, max_per_page=per_page
    )
    return paginated_result

def get_pagination_params(request):
    page = request.args.get("page", default=1, type=int)
    if page < 1:
        raise InvalidParamterException(description="page must be greater that 0")
    per_page = request.args.get("per_page", default=10, type=int)
    if per_page < 1:
        raise InvalidParamterException(description="per_page must be greater than 0")
    return page, per_page

def get_sort_params(request, table):
    sort_column = request.args.get("sort", default="state", type=str).lower()
    sort_desc = request.args.get(
        "desc", default=False, type=lambda v: v.lower() == "true"
    )
    if sort_column == "bed":
        if sort_desc == True:
            sort_column = "max_bed"
        else:
            sort_column = "min_bed"
    if sort_column == "rent":
        if sort_desc == True:
            sort_column = "max_rent"
        else:
            sort_column = "min_rent"
    if sort_column not in table.c:
        raise InvalidParamterException(description=f"{sort_column} is not sortable")
    return sort_column, sort_desc

@app.route("/housing", methods=["GET"])
def get_all_housing():
    try:
        fields = json_field_handler(request, table_columns)
        schema = all_housing_schema if fields is None else HousingSchema(only=fields, many=True)
        # retrieve params for filtering
        type_filter = request.args.get(
            "type",
            default=["apartment", "condo", "house", "townhome"],
            type=lambda v: v.split(","),
        )
        min_rent = request.args.get("min_rent", default=0, type=int)
        max_rent = request.args.get("max_rent", default=100000, type=int)
        min_bed = request.args.get("min_bed", default=0, type=float)
        max_bed = request.args.get("max_bed", default=100, type=float)
        rating = request.args.get("rating", default=0.0, type=float)
        walkscore = request.args.get(
            "walk_score", default=[0], type=lambda v: list(map(int, v.split(",")))
        )
        transitscore = request.args.get(
            "transit_score", default=[0], type=lambda v: list(map(int, v.split(",")))
        )
        walkscore_bounds = merge_ranges(walkscore)
        transitscore_bounds = merge_ranges(transitscore)

        # positional filters
        filter_params = normalize_query(request.args, ("city", "state"))
        filter_on = bool(filter_params)
        walkscore_spec = []
        transit_spec = []
        for bound in walkscore_bounds:
            walkscore_spec.append(
                f"""{getattr(Housing, 'walk_score')} >= {bound[0]} AND 
                    {getattr(Housing, 'walk_score')} <= {bound[1]}"""
            )
        for bound in transitscore_bounds:
            transit_spec.append(
                f"""{getattr(Housing, 'transit_score')} >= {bound[0]} AND 
                    {getattr(Housing, 'transit_score')} <= {bound[1]}"""
            )
        # query and paginate
        # get Query object
        sql_query = Housing.query
        # apply filters if detected
        sql_query = sql_query.filter(
            getattr(Housing, "property_type").in_(type_filter),
            getattr(Housing, "min_bed") >= min_bed,
            getattr(Housing, "max_bed") <= max_bed,
            getattr(Housing, "min_rent") >= min_rent,
            getattr(Housing, "max_rent") <= max_rent,
            getattr(Housing, "rating") >= rating,
            text(" OR ".join(walkscore_spec)),
            text(" OR ".join(transit_spec)),
        )
        if filter_on:
            sql_query = sql_query.filter_by(**filter_params)

        paginated_result = paginated_query_result_builder(request, sql_query, housing)
        return paginated_JSON_builder(paginated_result, schema, "properties")

    except InvalidParamterException as e:
        abort(400, e)
    except HTTPException as e:
        abort(e.code, e)
    except SQLAlchemyError as e:
        db.session.rollback()
    except Exception as e:
        abort(503, e)


@app.route("/housing/<string:id>", methods=["GET"])
def get_housing_by_id(id):
    try:
        sql = queries.query_images(id)
        result = db.session.execute(sql)
        if result.rowcount == 0:
            raise HousingNotFound(description=f"property with id:{id} does not exist")
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
    except HTTPException as e:
        abort(e.code, e)
    except SQLAlchemyError as e:
        db.session.rollback()
    except Exception as e:
        abort(503, e)

@app.route("/universities", methods=["GET"])
def get_all_universities():
    try:
        fields = json_field_handler(request, univ_columns)
        schema = all_univ_schema if fields is None else UniversitySchema(only=fields, many=True)
        # retrieve params for filtering
        ownership = request.args.get("ownership_id")
        accept = request.args.get("accept", type=float)
        grad = request.args.get("grad", type=float)

        # positional filters
        filter_params = normalize_query(request.args, univ_columns)
        filter_on = bool(filter_params)

        sql_query = University.query
        if ownership != None:
            sql_query = sql_query.filter(University.ownership_id == ownership)
        if filter_on:
            sql_query = sql_query.filter_by(**filter_params)
        if accept != None:
            sql_query = sql_query.filter(University.acceptance_rate >= accept)
        if grad != None:
            sql_query = sql_query.filter(University.graduation_rate >= grad)
        sql_query = sql_query.filter(University.rank != None)

        paginated_result = paginated_query_result_builder(request, sql_query, university)
        return paginated_JSON_builder(paginated_result, schema, "universities")
    except InvalidParamterException as e:
        abort(400, e)
    except HTTPException as e:
        abort(e.code, e)
    except SQLAlchemyError as e:
        db.session.rollback()
    except Exception as e:
        abort(503, e)



@app.route("/universities/<string:id>", methods=["GET"])
def get_univ_by_id(id):
    try:
        sql = queries.query_univ_images(id)
        result = db.session.execute(sql)
        if result.rowcount == 0:
            raise UniversityNotFound(description=f"university with id:{id} does not exist")
        univ = University.build_univ_from_args(*result)
        amen_sql = queries.query_univ_amen(id)
        amen_nearby = db.session.execute(amen_sql)
        hous_sql = queries.query_univ_housing(id)
        hous_nearby = db.session.execute(hous_sql)
        result.close()
        amenities = tuple(amen_nearby)
        housing = tuple(hous_nearby)
        univ.set_amen_nearby(amenities)
        univ.set_housing_nearby(housing)
        return jsonify(single_univ_schema.dump(univ))
    except HTTPException as e:
        abort(e.code, e)
    except SQLAlchemyError as e:
        db.session.rollback()
    except Exception as e:
        abort(503, e)


def reverse_own_map(term):
    if term in "Public":
        return 1
    elif term in "Private Non-Profit":
        return 2
    elif term in "Private For-Profit":
        return 3
    else:
        return term


def search_universities(query):
    sql = University.query
    for term in query:
        numb = reverse_own_map(term)
        check_owned = type(numb) == int
        sql = sql.filter(
            University.univ_name.ilike(f"%{term}%")
            | (check_owned and University.ownership_id == numb)
            | University.city.ilike(term)
            | University.state.ilike(term)
            | cast(University.rank, VARCHAR).ilike(term)
            | cast(University.acceptance_rate, VARCHAR).ilike(f"{term}")
            | cast(University.graduation_rate, VARCHAR).ilike(f"{term}")
            | cast(University.tuition_in_st, VARCHAR).ilike(term)
            | cast(University.tuition_out_st, VARCHAR).ilike(term)
            | cast(University.avg_cost_attendance, VARCHAR).ilike(term)
        )
    return sql


def search_amenities(query):
    sql_query = Amenities.query
    searches = []
    for term in query:
        # Check if query is float or int
        if re.match(r"^\d+(\.\d+)?$", term):
            if term.isdigit():
                searches.append(Amenities.num_review == int(term))
            searches.append(sqlalchemy.func.abs(Amenities.rating - float(term)) <= 1e-6)
        searches.append(Amenities.amen_name.ilike(f"%{term}%"))
        searches.append(Amenities.pricing.ilike(f"%{term}%"))
        searches.append(Amenities.state.ilike(f"%{term}%"))
        searches.append(Amenities.city.ilike(f"%{term}%"))
    return sql_query.filter(or_(*tuple(searches)))


@app.route("/amenities", methods=["GET"])
def get_all_amenities():
    # query and paginate
    try:
        fields = json_field_handler(request, amenities_table_columns)
        schema = all_amenities_schema if fields is None else AmenitiesSchema(only=fields, many=True)
        pricing_filter = request.args.get("price")
        pricing_list = (
            pricing_filter.split(",") if pricing_filter != None else pricing_filter
        )

        reviews = request.args.get("reviews", type=int)

        rating = request.args.get("rate", type=float)

        # positional filters
        filter_params = normalize_query(request.args, amenities_table_columns)
        filter_on = bool(filter_params)
        sql_query = Amenities.query
        if pricing_filter != None:
            sql_query = sql_query.filter(
                getattr(Amenities, "pricing").in_(pricing_list)
            )
        if filter_on:
            sql_query = sql_query.filter_by(**filter_params)
        if reviews != None:
            sql_query = sql_query.filter(Amenities.num_review >= reviews)
        if rating != None:
            sql_query = sql_query.filter(Amenities.rating >= rating)

        paginated_result = paginated_query_result_builder(request, sql_query, amenities)
        return paginated_JSON_builder(paginated_result, schema, "amenities")
    except InvalidParamterException as e:
        abort(400, e)
    except HTTPException as e:
        abort(e.code, e)
    except SQLAlchemyError as e:
        db.session.rollback()
    except Exception as e:
        abort(503, e)



@app.route("/amenities/<int:amen_id>", methods=["GET"])
def get_amenities_by_id(amen_id):
    try:
        amenity = Amenities.query.get(amen_id)
        if amenity is None:
            raise AmenityNotFound(description=f"amenity with id:{amen_id} does not exist")
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
    except HTTPException as e:
        abort(e.code, e)
    except SQLAlchemyError as e:
        db.session.rollback()
    except Exception as e:
        abort(503, e)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
