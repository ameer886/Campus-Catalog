from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql.schema import MetaData
from dotenv import load_dotenv, find_dotenv
import os


app = Flask(__name__)
CORS(app)
load_dotenv(find_dotenv())
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DB_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JSON_SORT_KEYS"] = False
app.debug = True
db = SQLAlchemy(app)

metadata = MetaData(db.engine)
metadata.reflect()
university = metadata.tables["university"]
housing = metadata.tables["housing"]
amenities = metadata.tables["amenities"]

# import routing
from . import main
