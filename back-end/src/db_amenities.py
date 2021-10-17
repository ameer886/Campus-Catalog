from db import db_init
from models import Amenities, AmenitiesImages, AmenitiesCategories, AmenitiesReviews
from flask import Flask
from dotenv import load_dotenv, find_dotenv
from yelpapi import YelpAPI
import os
import googlemaps
import uuid

app = Flask(__name__)
db = db_init(app)

# Initialize API clients with their respective API keys
load_dotenv(find_dotenv())
yelp_key = os.getenv("YELP_API_KEY")
google_key = os.getenv("GOOGLE_API_KEY")
yelp_api = YelpAPI(yelp_key)
gmaps = googlemaps.Client(key=google_key)

# Parameters for the search query
term = 'entertainment'
location = 'Princeton, NJ'
limit = 20
sort_by='rating'

amenities = []
images = []
reviews = []
categories = []

# Query yelp business search api for businesses that fit these parameters
search = yelp_api.search_query(term=term, location=location, limit=limit, sort_by=sort_by)

# Filter results
for item in [x for x in search['businesses'] if x['rating'] >= 3.7 and x['review_count'] >= 100]:
   # Generate id
   amen_id = uuid.uuid4().int>>98
   # Repeat id generation until there are no duplicates
   while Amenities.query.filter_by(amen_id=amen_id).first() is not None:
      amen_id = uuid.uuid4().int>>98
   amen_name = item['name']
   # Skip amenity if it already exists
   if Amenities.query.filter_by(amen_name=amen_name).first() is not None:
      continue

   amen_alias = item['alias']
   yelp_id = item['id']
   rating = item['rating']
   num_review = item['review_count']
   address = ' '.join(item['location']['display_address'])
   city = item['location']['city']
   state = item['location']['state']
   zip_code = item['location']['zip_code']
   latitude = item['coordinates']['latitude']
   longitude = item['coordinates']['longitude']
   pricing = item['price'] if item.get('price') else 'NaN'
   deliver = 'delivery' in item['transactions']
   takeout = 'pickup' in item['transactions']

   # Query google places API for hours
   g_place_search = gmaps.places(query=amen_name, location=(latitude, longitude))
   g_place_id = g_place_search['results'][0]['place_id']
   g_place = gmaps.place(place_id=g_place_id)
   hours = '\n'.join(g_place['result']['opening_hours']['weekday_text']) if g_place['result']['opening_hours'].get(['weekday_text']) else 'NaN'
   
   # Add new amenity to list
   amenities.append(Amenities(amen_id=amen_id, amen_name=amen_name, amen_alias=amen_alias, yelp_id=yelp_id, rating=rating, num_review=num_review, address=address, city=city, state=state, zip_code=zip_code, longitude=longitude, latitude=latitude, pricing=pricing, deliver=deliver, takeout=takeout, hours=hours))
   
   # Query yelp business API for images and categories
   y_place = yelp_api.business_query(id=yelp_id)
   image_query = y_place['photos']
   categories_query = y_place['categories']

   for image in image_query:
      id = uuid.uuid4().int>>98
      while AmenitiesImages.query.filter_by(id=id).first() is not None:
         id = uuid.uuid4().int>>98
      images.append(AmenitiesImages(id=id, amen_id=amen_id, url=image))

   for category in categories_query:
      id = uuid.uuid4().int>>98
      while AmenitiesCategories.query.filter_by(id=id).first() is not None:
         id = uuid.uuid4().int>>98
      categories.append(AmenitiesCategories(id=id, amen_id=amen_id, category=category['title']))

   # Query yelp reviews API
   review_query = yelp_api.reviews_query(id=yelp_id)['reviews']
   for review in review_query:
      id = uuid.uuid4().int>>98
      while AmenitiesReviews.query.filter_by(id=id).first() is not None:
         id = uuid.uuid4().int>>98
      reviews.append(AmenitiesReviews(id=id, amen_id=amen_id, review_id=review['id'], user_id=review['user']['id'], user_name=review['user']['name']))

# Add all entities and commit to database
db.session.add_all(amenities)
db.session.add_all(images)
db.session.add_all(reviews)
db.session.add_all(categories)
db.session.commit()


   



