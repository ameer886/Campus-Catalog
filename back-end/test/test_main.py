from logging import raiseExceptions
import unittest
import sys
from flask import Flask
from sqlalchemy import Table, MetaData

sys.path.append("..")
from src.db import db_init

class TestMain(unittest.TestCase):

    app = Flask(__name__)
    app.config['TESTING'] = True
    mock_db = db_init(app)

    def test_db_connection(self):
        self.assertIsNotNone(self.mock_db.engine)
        self.assertIsNotNone(self.mock_db.session)
    
    def test_db_dummy_table(self):
        metadata = MetaData(self.mock_db.engine)
        # load all existing table
        metadata.reflect()
        team = metadata.tables['Team']
        num_row = self.mock_db.session.query(team).count()
        self.assertEqual(num_row, 5)

        result = self.mock_db.session.query(team).filter(team.c.fname == 'David')
        self.assertEqual(result[0].gitId, 'ameer886')

if __name__ == "__main__":
    unittest.main()
