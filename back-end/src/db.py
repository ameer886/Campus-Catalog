from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv
import os

def db_init(app):
    load_dotenv(find_dotenv())
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DB_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.debug = True
    return SQLAlchemy(app)
