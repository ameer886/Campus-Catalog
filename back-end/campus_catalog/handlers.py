import requests
import os
import re
from flask import jsonify
from .exceptions import *
from .models import University, Housing, Amenities
from sqlalchemy.sql.sqltypes import VARCHAR
from sqlalchemy import text, desc, cast, or_, func


def youtube_search_handler(search_term):
    api_key = os.getenv("GOOGLE_GEOCODE_API_KEY")
    url = (
        "https://youtube.googleapis.com/youtube/v3/search?"
        f"key={api_key}&"
        "part=snippet&"
        "maxResults=5&"
        f"""q={'+'.join(search_term)}&"""
        "type=video&"
        "sort=viewCount&"
        "videoEmbeddable=true"
    )
    response = requests.get(url).json()
    video_list = response["items"]
    return video_list[0]["id"]["videoId"]


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
    fields = request.args.get("fields", type=lambda v: v.split(","))
    if fields is None:
        return fields
    difference = set(fields) - set(columns)
    if len(difference) > 0:
        raise InvalidParamterException(
            description=f"Invalid Fields: {difference}\n Please select from {set(columns)}"
        )
    return fields


def paginated_JSON_builder(data, schema, keyword):
    header = {
        "page": data.page,
        "per_page": data.per_page,
        "max_page": data.pages,
        "total_items": data.total,
    }
    content = schema.dump(data.items)
    return jsonify(header, {keyword: content})


def paginated_query_result_builder(request, query, table):
    page, per_page = get_pagination_params(request)
    column, descending = get_sort_params(request, table)
    order = desc(text(column)) if descending == True else text(column)
    paginated_result = query.order_by(order).paginate(page, max_per_page=per_page)
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


def reverse_own_map(term):
    if term in "Public":
        return 1
    elif term in "Private Non-Profit":
        return 2
    elif term in "Private For-Profit":
        return 3
    else:
        return term


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
            searches.append(func.abs(Amenities.rating - float(term)) <= 1e-6)
        searches.append(Amenities.amen_name.ilike(f"%{term}%"))
        searches.append(Amenities.pricing.ilike(f"%{term}%"))
        searches.append(Amenities.state.ilike(f"%{term}%"))
        searches.append(Amenities.city.ilike(f"%{term}%"))
    return sql_query.filter(or_(*tuple(searches)))
