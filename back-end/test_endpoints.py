import pytest

def test_empty_endpoint(client):
    rv = client.get('/')
    assert b'goodbye world' in rv.data

@pytest.mark.parametrize("endpoint",['/housing', '/amenities', 'universities'])
def test_housing_endpoint(client, endpoint):
    rv = client.get(endpoint)
    result = rv.get_json()

    assert len(result) == 2

    # test pagination header and default values
    header = result[0]
    assert "page" in header and header["page"] == 1
    assert "per_page" in header and header["per_page"] == 10
    assert "max_page" in header
    assert "total_items" in header

    content = result[1]
    assert type(content) == dict

