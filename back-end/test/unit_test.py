from logging import raiseExceptions
import unittest
import sys
from flask import Flask
from sqlalchemy import MetaData

sys.path.append("..")
from src.db import db_init
from src.models import University

class TestBackEnd(unittest.TestCase):

    # set up test environment
    app = Flask(__name__)
    app.config['TESTING'] = True
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
        team = metadata.tables['Team']
        num_row = self.mock_db.session.query(team).count()
        self.assertEqual(num_row, 5)

        result = self.mock_db.session.query(team).filter(team.c.fname == 'David')
        self.assertEqual(result[0].gitId, 'ameer886')
    
    def test_db_model_university(self):
        metadata = MetaData(self.mock_db.engine)
        # load all existing table
        metadata.reflect()
        univ = metadata.tables['university']
        original_row_count = self.mock_db.session.query(univ).count()
        
        # set up instance university
        dummy = dict()
        dummy['univ_id'] = 999
        dummy['univ_name'] = 'Dummy University'
        dummy['alias'] = "DumU"
        dummy['rank'] = 2
        dummy['city'] = 'Shanghai'
        dummy['state'] = 'SH'
        dummy['zip_code'] = '38141'
        dummy['school_url'] = 'www.dum.com'
        dummy['locale'] = 3
        dummy['carnegie_undergrad'] = 2
        dummy['num_undergrad'] = 1
        dummy['num_graduate'] = 0
        dummy['avg_cost_attendance'] = 0
        dummy['ownership_id'] = 1
        dummy['mascot_name'] = 'me'
        dummy['acceptance_rate'] = 0.0
        dummy['graduation_rate'] = 100.0
        dummy['tuition_in_st'] = 0
        dummy['tuition_out_st'] = 0
        dummy['avg_sat'] = 0
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


if __name__ == "__main__":
    unittest.main()
