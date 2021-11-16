import pytest
from random import randint

def test_empty_endpoint(client):
    rv = client.get('/')
    assert b'goodbye world' in rv.data

@pytest.mark.parametrize("endpoint",['/housing', '/amenities', '/universities'])
def test_model_endpoint(client, endpoint):
    rv = client.get(endpoint)
    result = rv.get_json()

    assert rv.status_code == 200
    assert len(result) == 2

    # test pagination header and default values
    header = result[0]
    assert "page" in header and header["page"] == 1
    assert "per_page" in header and header["per_page"] == 10
    assert "max_page" in header
    assert "total_items" in header

    # test JSON content
    content = result[1]
    assert type(content) == dict
    assert len(content) == 1

    item = list(content.items())[0][1]
    assert type(item) == list
    assert len(item) == header["per_page"]

@pytest.mark.parametrize("endpoint",['/housing', '/amenities', '/universities'])
def test_pagination_when_page_not_found(client, endpoint):
    rv = client.get(f"{endpoint}?page=1400")
    assert rv.status_code == 404

@pytest.mark.parametrize("endpoint",['/housing', '/amenities', '/universities'])
def test_pagination_param_per_page(client, endpoint):
    per_page = randint(0, 100)
    rv = client.get(f"{endpoint}?per_page={per_page}")
    assert rv.status_code == 200

    result = rv.get_json()
    header = result[0]
    assert header["page"] == 1
    assert header["per_page"] == per_page

    content = result[1]
    items = list(content.items())[0][1]
    assert len(items) == per_page

@pytest.mark.parametrize("endpoint",['/housing', '/amenities', '/universities'])
def test_sorting_param_column_not_found(client, endpoint):
    rv = client.get(f"{endpoint}?sort=something")
    assert rv.status_code == 400

@pytest.mark.parametrize("endpoint",['/housing', '/amenities', '/universities'])
def test_default_sorting_param(client, endpoint):
    rv = client.get(f"{endpoint}?per_page=200")
    assert rv.status_code == 200

    result = rv.get_json()
    content = result[1]
    items = list(content.items())[0][1]
    # all endpoints are default sorted by state
    assert all(items[i]['state'] <= items[i + 1]['state'] for i in range(len(items) - 1))

@pytest.mark.parametrize("endpoint",['/housing', '/amenities', '/universities'])
def test_default_sorting_param_desc(client, endpoint):
    rv = client.get(f"{endpoint}?desc=true&per_page=200")
    assert rv.status_code == 200

    result = rv.get_json()
    content = result[1]
    items = list(content.items())[0][1]
    # all endpoints are default sorted by state
    assert all(items[i]['state'] >= items[i + 1]['state'] for i in range(len(items) - 1))

@pytest.mark.parametrize("endpoint",['/housing', '/amenities', '/universities'])
def test_single_instance_endpoint_with_error(client, endpoint):
    rv = client.get(f"{endpoint}/52543")
    assert rv.status_code == 404

### Housing Model Tests ###

@pytest.mark.parametrize("prop_type",['apartment','condo','house','townhome'])
def test_housing_filter_property_type(client, prop_type):
    rv = client.get(f"/housing?type={prop_type}")
    assert rv.status_code == 200
    result = rv.get_json()
    content = result[1]
    items = list(content.items())[0][1]
    for _i in items:
        assert _i["property_type"] == prop_type

@pytest.mark.parametrize("min_bed",[i for i in range(5)])
@pytest.mark.parametrize("max_bed",[i for i in range(2,6)])
def test_housing_filter_bed(client, min_bed, max_bed):
    rv = client.get(f"/housing?min_bed={min_bed}&max_bed={max_bed}&per_page=200")
    assert rv.status_code == 200
    result = rv.get_json()
    content = result[1]
    items = list(content.items())[0][1]
    for _i in items:
        assert _i["bed"]["min"] >= min_bed
        assert _i["bed"]["max"] <= max_bed

@pytest.mark.parametrize("rating",[i for i in range(5)])
def test_housing_filter_rating(client, rating):
    rv = client.get(f"/housing?rating={rating}&per_page=200")
    assert rv.status_code == 200
    result = rv.get_json()
    content = result[1]
    items = list(content.items())[0][1]
    for _i in items:
        assert _i["rating"] >= rating

@pytest.mark.parametrize("walkscore",[i for i in range(5)])
def test_housing_filter_walkscore(client, walkscore):
    score_dict = {0: (0, 100), 1: (90, 100), 2: (70, 89), 3: (50, 69), 4: (25, 49), 5: (0, 24)}
    rv = client.get(f"/housing?walk_score={walkscore}&per_page=200")
    assert rv.status_code == 200
    result = rv.get_json()
    content = result[1]
    items = list(content.items())[0][1]
    for _i in items:
        bound = score_dict[walkscore]
        assert _i["walk_score"] >= bound[0] and _i["walk_score"] <= bound[1]

@pytest.mark.parametrize("transitscore",[i for i in range(5)])
def test_housing_filter_walkscore(client, transitscore):
    score_dict = {0: (0, 100), 1: (90, 100), 2: (70, 89), 3: (50, 69), 4: (25, 49), 5: (0, 24)}
    rv = client.get(f"/housing?transit_score={transitscore}&per_page=200")
    assert rv.status_code == 200
    result = rv.get_json()
    content = result[1]
    items = list(content.items())[0][1]
    for _i in items:
        bound = score_dict[transitscore]
        assert _i["transit_score"] >= bound[0] and _i["transit_score"] <= bound[1]


### University Model Tests ###
