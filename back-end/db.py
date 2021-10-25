from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv
import os

# config Flask app with secret keys
def db_init(app):
    load_dotenv(find_dotenv())
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DB_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JSON_SORT_KEYS"] = False
    app.debug = True
    return SQLAlchemy(app)
