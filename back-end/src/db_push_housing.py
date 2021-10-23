from operator import and_
from requests.models import Response
from sqlalchemy.sql.schema import MetaData
from main import db
from models import Housing, HousingImages
import os
import requests
import us
from requests.exceptions import HTTPError
from apify_client import ApifyClient
import googlemaps

# load existing tables
metadata = MetaData(db.engine)
metadata.reflect()
university = metadata.tables['university']
housing = metadata.tables['housing']
housingImages = metadata.tables['housingImages']

gmaps = googlemaps.Client(key=os.getenv('GOOGLE_GEOCODE_API_KEY'))

# find longitude and latitude for all properties
def populate_geocode():
    results = db.session.query(housing.c.property_id, housing.c.address, housing.c.city, housing.c.state).all()
    for location in results:
        property_id = location[0]
        full_address = ', '.join(location[1:])
        geocode = gmaps.geocode(full_address)
        if len(geocode) < 1:
            continue
        lat = geocode[0]['geometry']['location']['lat']
        lon = geocode[0]['geometry']['location']['lng']
        print(f"{property_id}: {lat} {lon}")
        db.session.query(housing).filter(housing.c.property_id == property_id).update({housing.c.lat: lat, housing.c.lon: lon})
        db.session.commit()

# populate all type of housing using APIFY and their api
def populate_housing():
    print('Starting to populate housing')
    
    # initialize client for scraper
    client = ApifyClient(token=os.getenv("APIFY_API_KEY"))
    print('Complete setting up APIFY client')

    # find distinct city and states in university table
    location_list = db.session.query(university.c.city, university.c.state).filter(university.c.rank <= 200).order_by(university.c.state).distinct()
    for location in location_list:
        # reformat location to fit APIFY search input
        location = '-'.join(location).lower().replace(' ', '-')
        # populate properties by category
        populate_apartments(client, location)
        populate_condos(client, location)
        populate_houses(client, location)
        populate_townhomes(client, location)
        db.session.commit()
    print('All housing populated')

def populate_apartments(client, location):
    print(f'Populating Apartments for {location}')
    populate_property('apartment', client, 8, 200, location)
    
def populate_condos(client, location):
    print(f'Populating Condos for {location}')
    populate_property('condo', client, 1, 25, location)

def populate_houses(client, location):
    print(f'Populating Houses for {location}')
    populate_property('house', client, 1, 25, location)

def populate_townhomes(client, location):
    print(f'Populating Townhomes for {location}')
    populate_property('townhome', client, 1, 25, location)

# builds the APIFY run input required by the Apartment.com scraper
def get_apify_input(type, max_page, max_property, location):
    func = "{\"propertyType\" : \"" + type + "\"}"
    return {
        "startUrls": [get_query_url(type, location)],
        "proxy": { "useApifyProxy": True},
        "endPage": max_page,
        "maxItems": max_property,
        "extendOutputFunction": "($) => { return " + func + "}"
    }

def get_query_url(type, location):
    return f"https://www.apartments.com/{type}s/{location}/"

def get_json_response(dataset_id):
    try:
        response = requests.get(
            f'''https://api.apify.com/v2/datasets/{dataset_id}/items?token={os.getenv("APIFY_API_KEY")}&format=json&clean=false&fields=id,propertyName,propertyType,url,location,rating,isVerified,rent,beds,baths,sqft,scores,fees,amenities,photos'''
            )
        # check if HTTP error exists
        response.raise_for_status()
        json_response = response.json()
        return json_response
    except HTTPError as http_err:
        print(f'HTTP error occured {http_err}')
    except Exception as err:
        print(f'Other error occurred {err}')

def populate_property(property_type, client, max_page, max_property, location):
    run_input = get_apify_input(property_type, max_page, max_property, location)
    run = client.actor("tugkan/apartments-scraper").call(run_input=run_input, build='latest', memory_mbytes=8192, timeout_secs=0)
    dataset_id = run['defaultDatasetId']
    json_response = get_json_response(dataset_id)
    # delete dataset when done parsing to prevent storage costs
    client.dataset(dataset_id).delete()

    num_added = 0
    for property in json_response:    
        # skip properties without min and max rent specified
        if property['rent']['min'] is None and property['rent']['max'] is None:
            continue
        # skip properties without rooms and square-footage specified
        if property['beds'] is None or property['baths'] is None or property['sqft'] is None:
            continue
        # skip properties without photos
        if property['photos'] is None:
            continue
        # skip unverified apartments and unrated
        if property['propertyType'] == 'apartment' and (property['isVerified'] == False or property['rating'] is None):
            continue
        
        num_added = num_added + parse_json(property)

    print(f'Added {num_added} properties')

def parse_json(property):
    result = {}
    result['property_id'] = property['id']
    result['property_name'] = property['propertyName']
    result['property_type'] = property['propertyType']
    result['address'] = property['location']['streedAddress']
    result['neighborhood'] = property['location']['neighborhood']
    result['city'] = property['location']['city']
    result['state'] = us.states.lookup(property['location']['state']).abbr
    result['zip_code'] = property['location']['postalCode']
    result['min_rent'] = property['rent']['min']
    result['max_rent'] = property['rent']['max']
    result['rating'] = property['rating']
    result['walk_score'] = property['scores']['walkScore']
    result['transit_score'] = property['scores']['transitScore']
    bed_range = split_range(property['beds'])
    result['min_bed'] = bed_range[0]
    result['max_bed'] = bed_range[1]
    bath_range = split_range(property['baths'])
    result['min_bath'] = bath_range[0]
    result['max_bath'] = bath_range[1]
    sqft_range = split_range(property['sqft'])
    result['min_sqft'] = sqft_range[0]
    result['max_sqft'] = sqft_range[1]

    for policy in property['fees']:
        if 'Pet Policies' in policy['title']:
            parse_pet_policy(result, policy['policies'])
        if 'Details' in policy['title']:
            parse_included_util(result, policy['policies'])
    
    amenity_list = []
    for building_amenity in property['amenities']: 
        for amenity in building_amenity['value']:
            if amenity.replace(',',' ') not in amenity_list:
                amenity_list.append(amenity.replace(',',' '))
    result['building_amenities'] = ','.join(amenity_list)
    house = Housing(**result)

    if db.session.query(housing).filter(and_(housing.c.property_id == house.get_id(), housing.c.property_type == house.get_type())).count() < 1:
        db.session.add(house)
        populate_photos(result['property_id'], result['property_type'], property['photos'])
        return 1
    return 0

def populate_photos(prop_id, prop_type, photos):
    for photo in photos:
        housingImage = HousingImages(prop_id, prop_type, photo)
        if db.session.query(housingImages).filter(housingImages.c.image_url == photo).count() < 1:
            db.session.add(housingImage)

def parse_pet_policy(result, policy):
    for item in policy:
        if item['header'] == 'Dogs Allowed':
            result['dog_allow'] = True
            value_pairs = item['values']
            for value in value_pairs:
                if value['key'] == 'Pet Limit':
                    if value['value'].isnumeric():
                        result['max_num_dog'] = int(value['value'])
                    else:
                        result['max_num_dog'] = None
                if value['key'] == 'Weight limit':
                    if value['value'].rstrip(' lb').isnumeric():
                        result['dog_weight'] = int(value['value'].rstrip(' lb'))
                    else:
                        result['dog_weight'] = None
        if item['header'] == 'Cats Allowed':
            result['cat_allow'] = True
            value_pairs = item['values']
            for value in value_pairs:
                if value['key'] == 'Pet Limit':
                    if value['value'].isnumeric():
                        result['max_num_cat'] = int(value['value'])
                    else:
                        result['max_num_cat'] = None
                if value['key'] == 'Weight limit':
                    if value['value'].rstrip(' lb').isnumeric():
                        result['cat_weight'] = int(value['value'].rstrip(' lb'))
                    else:
                        result['cat_weight'] = None

def parse_included_util(result, policy):
    for item in policy:
        if item['header'] == 'Utilities Included':
            util_list = []
            for util in item['values']:
                util_list.append(util['key'])
            result['util_included'] = ','.join(util_list)
            break
        else:
            result['util_included'] = None
            
# convert range in the form of string into list of two integer
def split_range(range):
    # edge case: JSON values are null
    if range == '':
        return [None, None]

    # remove possible commas
    range = range.replace(',', '')
    # strip trailing characters
    range = range.rstrip(' sqftbad')
    # split around dash
    min_max = range.split('-')
    if len(min_max) == 1:
        return [0, 0] if min_max[0].find('Studio') != -1 else [float(min_max[0]), float(min_max[0])]
    else:
        return [0, float(min_max[1])] if min_max[0].find('Studio') != -1 else [float(min_max[0]), float(min_max[1])]

if __name__ == '__main__':
    populate_geocode()
    #populate_housing()