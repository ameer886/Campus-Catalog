from flask import Flask
from db import db_init

app = Flask(__name__)
database = db_init(app)
