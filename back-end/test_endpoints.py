import pytest

def test_empty_endpoint(client):
    rv = client.get('/')
    assert b'goodbye world' in rv.data

@pytest.mark.parametrize("endpoint",['/housing', '/amenities', 'universities'])
def test_model_endpoint(client, endpoint):
    rv = client.get(endpoint)
    result = rv.get_json()

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


def test_housing(client):
    rv = client.get('/housing')
    result = rv.get_json()
    content = result[1]
    items = list(content.items())[0][1]
    for _item in items:
        assert "property_id" in _item and _item["property_id"] is not None
        assert "property_name" in _item and _item["property_name"] is not None
