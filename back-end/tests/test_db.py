import unittest
from sqlalchemy import MetaData

from campus_catalog import app, db
from campus_catalog.models import University, Housing, Amenities


class TestBackEnd(unittest.TestCase):

    # set up test environment
    app.config["TESTING"] = True
    mock_db = db

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
        dummy["mascot_name"] = None
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


if __name__ == "__main__":
    unittest.main()
