from flask import jsonify, request, abort
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from werkzeug.exceptions import HTTPException

from .models import University, Housing, Amenities
from .schemas import *
from .exceptions import *
from .handlers import (
    search_housing,
    search_amenities,
    search_universities,
    merge_ranges,
    youtube_search_handler,
    normalize_query,
    json_field_handler,
    paginated_JSON_builder,
    paginated_query_result_builder,
)
from campus_catalog import app, db, university, housing, amenities
import campus_catalog.queries as queries

# routing for Elastic Beanstalk health check
@app.route("/")
def home():
    return "<h1> goodbye world </h1>"


@app.route("/search", methods=["GET"])
def search():
    try:
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
        amenities_per_page = request.args.get(
            "amenities_per_page", default=10, type=int
        )
        amenities = {}
        amenities_pagination_header = {}
        if "Amenities" in models:
            amenities_query = search_amenities(query_terms)
            amenities_paginated_response = amenities_query.paginate(
                amenities_page, error_out=False, max_per_page=amenities_per_page
            )
            amenities = {
                "amenities": all_amenities_schema.dump(
                    amenities_paginated_response.items
                )
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

    except InvalidParamterException as e:
        abort(400, e)
    except HTTPException as e:
        abort(e.code, e)
    except SQLAlchemyError as e:
        db.session.rollback()
        raise
    except Exception as e:
        abort(503, f"{type(e)}: {e}")
    finally:
        db.session.commit()
        db.session.close()


@app.route("/housing", methods=["GET"])
def get_all_housing():
    try:
        fields = json_field_handler(request, table_columns)
        schema = (
            all_housing_schema
            if fields is None
            else HousingSchema(only=fields, many=True)
        )
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
        raise
    except Exception as e:
        abort(503, f"{type(e)}: {e}")
    finally:
        db.session.commit()
        db.session.close()

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
        raise
    except Exception as e:
        abort(503, f"{type(e)}: {e}")
    finally:
        db.session.commit()
        db.session.close()

@app.route("/universities", methods=["GET"])
def get_all_universities():
    try:
        fields = json_field_handler(request, univ_columns)
        schema = (
            all_univ_schema
            if fields is None
            else UniversitySchema(only=fields, many=True)
        )

        # retrieve params for filtering
        accept = request.args.get("accept", default=0.0, type=float)
        grad = request.args.get("grad", default=0.0, type=float)
        unranked = request.args.get(
            "unranked", default=False, type=lambda v: v.lower() == "true"
        )
        # positional filters
        filter_params = normalize_query(request.args, univ_columns)
        filter_on = bool(filter_params)

        sql_query = University.query
        sql_query = sql_query.filter(
            University.acceptance_rate >= accept,
            University.graduation_rate >= grad,
            University.rank.is_(None)
            if unranked == True
            else University.rank.is_not(None),
        )
        if filter_on:
            sql_query = sql_query.filter_by(**filter_params)

        paginated_result = paginated_query_result_builder(
            request, sql_query, university
        )
        return paginated_JSON_builder(paginated_result, schema, "universities")
    except InvalidParamterException as e:
        abort(400, e)
    except HTTPException as e:
        abort(e.code, e)
    except SQLAlchemyError as e:
        db.session.rollback()
        raise
    except Exception as e:
        abort(503, f"{type(e)}: {e}")
    finally:
        db.session.commit()
        db.session.close()

@app.route("/universities/<string:id>", methods=["GET"])
def get_univ_by_id(id):
    try:
        sql = queries.query_univ_images(id)
        result = db.session.execute(sql)
        if result.rowcount == 0:
            raise UniversityNotFound(
                description=f"university with id:{id} does not exist"
            )
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
        yt_video_id = youtube_search_handler(univ.univ_name.split(" "))
        univ.set_video(yt_video_id)
        return jsonify(single_univ_schema.dump(univ))
    except HTTPException as e:
        abort(e.code, e)
    except SQLAlchemyError as e:
        db.session.rollback()
        raise
    except Exception as e:
        abort(503, f"{type(e)}: {e}")
    finally:
        db.session.commit()
        db.session.close()

@app.route("/amenities", methods=["GET"])
def get_all_amenities():
    # query and paginate
    try:
        fields = json_field_handler(request, amenities_table_columns)
        schema = (
            all_amenities_schema
            if fields is None
            else AmenitiesSchema(only=fields, many=True)
        )

        pricing_filter = request.args.get(
            "price", default=["$", "$$", "$$$", "$$$$"], type=lambda v: v.split(",")
        )
        reviews = request.args.get("reviews", default=0, type=int)
        rating = request.args.get("rate", default=0.0, type=float)

        # positional filters
        filter_params = normalize_query(request.args, amenities_table_columns)
        filter_on = bool(filter_params)
        sql_query = Amenities.query
        sql_query = sql_query.filter(
            Amenities.pricing.in_(pricing_filter),
            Amenities.num_review >= reviews,
            Amenities.rating >= rating,
        )
        if filter_on:
            sql_query = sql_query.filter_by(**filter_params)

        paginated_result = paginated_query_result_builder(request, sql_query, amenities)
        return paginated_JSON_builder(paginated_result, schema, "amenities")
    except InvalidParamterException as e:
        abort(400, e)
    except HTTPException as e:
        abort(e.code, e)
    except SQLAlchemyError as e:
        db.session.rollback()
        raise
    except Exception as e:
        abort(503, f"{type(e)}: {e}")
    finally:
        db.session.commit()
        db.session.close()

@app.route("/amenities/<int:amen_id>", methods=["GET"])
def get_amenities_by_id(amen_id):
    try:
        amenity = Amenities.query.get(amen_id)
        if amenity is None:
            raise AmenityNotFound(
                description=f"amenity with id:{amen_id} does not exist"
            )
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
        raise
    except Exception as e:
        abort(503, f"{type(e)}: {e}")
    finally:
        db.session.commit()
        db.session.close()

@app.route("/summary", methods=["GET"])
def get_data_summary():
    try:
        stmt = text(queries.data_summary_query())
        result = db.session.execute(stmt)
        return jsonify(data_summary_schema.dump(result))
    except HTTPException as e:
        abort(e.code, e)
    except SQLAlchemyError as e:
        db.session.rollback()
        raise
    except Exception as e:
        abort(503, f"{type(e)}: {e}")
    finally:
        db.session.commit()
        db.session.close()
