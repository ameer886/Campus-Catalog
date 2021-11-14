from logging import raiseExceptions
import unittest
import sys
from flask import Flask
from sqlalchemy import MetaData
import json
import urllib
import requests

from db import db_init
from models import University, Housing, Amenities


class TestBackEnd(unittest.TestCase):

    # set up test environment
    app = Flask(__name__)
    app.config["TESTING"] = True
    mock_db = db_init(app)

    # test database connection established
    def test_db_connection(self):
        self.assertIsNotNone(self.mock_db.engine)
        self.assertIsNotNone(self.mock_db.session)

    # test connection by querying dummy table
    def test_db_dummy_table(self):
        metadata = MetaData(self.mock_db.engine)
        # load all existing table
        metadata.reflect()
        team = metadata.tables["Team"]
        num_row = self.mock_db.session.query(team).count()
        self.assertEqual(num_row, 5)

        result = self.mock_db.session.query(team).filter(team.c.fname == "David")
        self.assertEqual(result[0].gitId, "ameer886")

    def test_db_model_university(self):
        metadata = MetaData(self.mock_db.engine)
        # load all existing table
        metadata.reflect()
        univ = metadata.tables["university"]
        original_row_count = self.mock_db.session.query(univ).count()

        # set up instance university
        dummy = dict()
        dummy["univ_id"] = 999
        dummy["univ_name"] = "Dummy University"
        dummy["alias"] = "DumU"
        dummy["rank"] = 2
        dummy["city"] = "Shanghai"
        dummy["state"] = "SH"
        dummy["zip_code"] = "38141"
        dummy["school_url"] = "www.dum.com"
        dummy["locale"] = 3
        dummy["carnegie_undergrad"] = 2
        dummy["num_undergrad"] = 1
        dummy["num_graduate"] = 0
        dummy["avg_cost_attendance"] = 0
        dummy["ownership_id"] = 1
        dummy["acceptance_rate"] = 0.0
        dummy["graduation_rate"] = 100.0
        dummy["tuition_in_st"] = 0
        dummy["tuition_out_st"] = 0
        dummy["avg_sat"] = 0
        dummy_university = University(**dummy)

        # add instance to table
        self.mock_db.session.add(dummy_university)
        self.mock_db.session.commit()
        num_row = self.mock_db.session.query(univ).count()
        self.assertEqual(num_row, original_row_count + 1)

        # remove dummy instance
        self.mock_db.session.query(univ).filter(univ.c.univ_id == 999).delete()
        self.mock_db.session.commit()
        num_row = self.mock_db.session.query(univ).count()
        self.assertEqual(num_row, original_row_count)

    def test_db_model_housing(self):
        metadata = MetaData(self.mock_db.engine)
        # load all existing table
        metadata.reflect()
        hous = metadata.tables["housing"]
        original_row_count = self.mock_db.session.query(hous).count()

        # set up instance housing
        dummy = dict()
        dummy["property_id"] = "999"
        dummy["property_name"] = "Dummy Home"
        dummy["property_type"] = "Dumb"
        dummy["address"] = "Dummi"
        dummy["city"] = "Shanghai"
        dummy["state"] = "SH"
        dummy["zip_code"] = "38141"
        dummy["neighborhood"] = "DumCom"
        dummy["min_rent"] = 2
        dummy["max_rent"] = 1
        dummy["min_bed"] = 0
        dummy["max_bed"] = 0
        dummy["walk_score"] = 1
        dummy["transit_score"] = 0
        dummy["building_amenities"] = "nada"
        dummy["util_included"] = "nothing"
        dummy["dog_allow"] = False
        dummy["cat_allow"] = True
        dummy["rating"] = 0
        dummy_housing = Housing(**dummy)

        # add instance to table
        self.mock_db.session.add(dummy_housing)
        self.mock_db.session.commit()
        num_row = self.mock_db.session.query(hous).count()
        self.assertEqual(num_row, original_row_count + 1)

        # remove dummy instance
        self.mock_db.session.query(hous).filter(hous.c.property_id == "999").delete()
        self.mock_db.session.commit()
        num_row = self.mock_db.session.query(hous).count()
        self.assertEqual(num_row, original_row_count)

    def test_db_model_amenity(self):
        metadata = MetaData(self.mock_db.engine)
        # load all existing table
        metadata.reflect()
        amen = metadata.tables["amenities"]
        original_row_count = self.mock_db.session.query(amen).count()

        # set up instance amenity
        dummy = dict()
        dummy["amen_id"] = 999
        dummy["amen_name"] = "Dummy"
        dummy["amen_alias"] = "DumU"
        dummy["rating"] = 2
        dummy["city"] = "Shanghai"
        dummy["state"] = "SH"
        dummy["zip_code"] = "38141"
        dummy["yelp_id"] = "yelpers"
        dummy["longitude"] = 0
        dummy["latitude"] = 0
        dummy["pricing"] = "free"
        dummy["deliver"] = True
        dummy["takeout"] = False
        dummy["hours"] = "7832pm"
        dummy_amenity = Amenities(**dummy)

        # add instance to table
        self.mock_db.session.add(dummy_amenity)
        self.mock_db.session.commit()
        num_row = self.mock_db.session.query(amen).count()
        self.assertEqual(num_row, original_row_count + 1)

        # remove dummy instance
        self.mock_db.session.query(amen).filter(amen.c.amen_id == 999).delete()
        self.mock_db.session.commit()
        num_row = self.mock_db.session.query(amen).count()
        self.assertEqual(num_row, original_row_count)

    # def test_endpoint1(self):
    #     url = "https://api.campuscatalog.me/housing"
    #     r = urllib.request.urlopen(url)
    #     data = json.loads(r.read())
    #     self.assertEqual(data["properties"][0]["city"], "Auburn")
    #     self.assertEqual(data["properties"][0]["max_rent"], 800)
    #     self.assertEqual(data["properties"][0]["max_sqft"], 1000.0)
    #     self.assertEqual(data["properties"][0]["property_id"], "35erbsf")
    #     self.assertEqual(data["properties"][0]["property_name"], "343 S Gay St")
    #     self.assertEqual(data["properties"][0]["property_type"], "condo")
    #     self.assertEqual(data["properties"][0]["rating"], 0.0)
    #     self.assertEqual(data["properties"][0]["state"], "AL")
    #     self.assertEqual(data["properties"][0]["transit_score"], 0)
    #     self.assertEqual(data["properties"][0]["walk_score"], 62)

    # def test_endpoint2(self):
    #     url = "https://api.campuscatalog.me/amenities"
    #     r = urllib.request.urlopen(url)
    #     data = json.loads(r.read())
    #     self.assertEqual(data["amenities"][0]["amen_id"], 462165312)
    #     self.assertEqual(data["amenities"][0]["amen_name"], "Elephant Room")
    #     self.assertEqual(data["amenities"][0]["city"], "Austin")
    #     self.assertEqual(data["amenities"][0]["deliver"], False)
    #     self.assertEqual(data["amenities"][0]["num_review"], 431)
    #     self.assertEqual(data["amenities"][0]["pricing"], "$$")
    #     self.assertEqual(data["amenities"][0]["state"], "TX")
    #     self.assertEqual(data["amenities"][0]["takeout"], False)

    # def test_endpoint3(self):
    #     url = "https://api.campuscatalog.me/universities"
    #     r = urllib.request.urlopen(url)
    #     data = json.loads(r.read())
    #     self.assertEqual(data["universities"][0]["city"], "Haverhill")
    #     self.assertEqual(data["universities"][0]["ownership_id"], "Public")
    #     self.assertEqual(data["universities"][0]["state"], "MA")
    #     self.assertEqual(data["universities"][0]["tuition_in_st"], 5280)
    #     self.assertEqual(data["universities"][0]["tuition_out_st"], 11064)
    #     self.assertEqual(data["universities"][0]["univ_id"], "167376")
    #     self.assertEqual(
    #         data["universities"][0]["univ_name"], "Northern Essex Community College"
    #     )

    # def test_endpoint4(self):
    #     url = "https://api.campuscatalog.me/universities/100663"
    #     r = urllib.request.urlopen(url)
    #     data = json.loads(r.read())
    #     self.assertEqual(data["acceptance_rate"], 0.7366)
    #     self.assertEqual(data["avg_cost_attendance"], 24495.0)
    #     self.assertEqual(data["amenities_nearby"][0]["amenity_id"], "48971135")
    #     self.assertEqual(data["avg_sat"], 1234.0)
    #     self.assertEqual(
    #         data["carnegie_undergrad"],
    #         "Four-year, medium full-time, selective, higher transfer-in",
    #     )
    #     self.assertEqual(data["graduation_rate"], 0.634)
    #     self.assertEqual(data["housing_nearby"][0]["property_id"], "jch15k4")
    #     self.assertEqual(data["longitude"], -86.79935)
    #     self.assertEqual(data["num_graduate"], 10897)

    def test_endpoint5(self):
        url = "https://api.campuscatalog.me/amenities/485770102"
        r = urllib.request.urlopen(url)
        data = json.loads(r.read())
        self.assertEqual(data["address"], "2015 E M Franklin Ave Austin, TX 78723")
        self.assertEqual(
            data["amen_alias"], "blue-starlite-mini-urban-drive-in-austin-3"
        )
        self.assertEqual(data["amen_id"], 485770102)
        self.assertEqual(data["amen_name"], "Blue Starlite Mini Urban Drive-In")
        self.assertEqual(data["categories"][0], "Drive-In Theater")
        self.assertEqual(data["city"], "Austin")
        self.assertEqual(data["deliver"], False)
        self.assertEqual(
            data["hours"],
            "Monday: 7:45 \u2013 11:30 PM\nTuesday: 7:45 \u2013 10:00 PM\nWednesday: 7:45 \u2013 10:00 PM\nThursday: 7:45 PM \u2013 12:00 AM\nFriday: 7:45 PM \u2013 12:00 AM\nSaturday: 7:45 PM \u2013 12:00 AM\nSunday: 7:30 \u2013 11:30 PM",
        )
        self.assertEqual(data["housing_nearby"][0]["property_id"], "85j4gs0")

    def test_endpoint6(self):
        url = "https://api.campuscatalog.me/housing/sqj5kb7"
        r = urllib.request.urlopen(url)
        data = json.loads(r.read())
        self.assertEqual(data["amenities_nearby"][0]["amenity_id"], "89470460")
        self.assertEqual(data["bath"]["max"], 0.5)
        self.assertEqual(data["bed"]["max"], 0.0)
        self.assertEqual(data["building_amenities"][0], "Washer/Dryer - In Unit")
        self.assertEqual(data["cat_allow"], False)
        self.assertEqual(data["dog_allow"], False)
        self.assertEqual(
            data["images"][0],
            "https://images1.apartments.com/i2/2FXViLtJdfie7JYpAkCeEKNNsU0AtIH_pf2zE7CaSno/111/161-s-prospect-st-burlington-vt-primary-photo.jpg?p=1",
        )
        self.assertEqual(data["location"]["city"], "Burlington")
        self.assertEqual(data["max_num_cat"], 0)
        self.assertEqual(data["max_num_dog"], 0)
        self.assertEqual(data["max_rent"], 1100)
        self.assertEqual(data["min_rent"], 1100)
        self.assertEqual(data["property_id"], "sqj5kb7")
        self.assertEqual(data["property_type"], "condo")
        self.assertEqual(data["sqft"]["max"], 220.0)
        self.assertEqual(data["transit_score"], 47)
        self.assertEqual(data["universities_nearby"][0]["university_id"], "231174")
        self.assertEqual(data["util_included"][0], "Water")
        self.assertEqual(data["walk_score"], 77)


if __name__ == "__main__":
    unittest.main()
