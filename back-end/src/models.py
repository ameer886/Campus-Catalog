from enum import unique
from flask import Flask, request
from sqlalchemy import Column, Integer
from db import db_init

app = Flask(__name__)
db = db_init(app)

class University(db.Model):
    __tablename__ = 'university'
    univ_id = db.Column(db.Integer, primary_key=True)
    univ_name = db.Column(db.String(128), unique=True, nullable=False)
    rank = db.Column(db.Integer, nullable=True)
    city = db.Column(db.String(128), nullable=False)
    state = db.Column(db.String(2), nullable=False)
    num_student = db.Column(db.Integer, nullable=False)
    is_private = db.Column(db.Boolean)
    mascot_name = db.Column(db.String(255), nullable=True)
    acceptance_rate = db.Column(db.Float, nullable=False)
    graduation_rate = db.Column(db.Float, nullable=False)
    tuition_in_st = db.Column(db.Float, nullable=False)
    tuition_out_st = db.Column(db.Float, nullable=False)
    avg_fin_aid = db.Column(db.Float, nullable=True)
    
    def __repr__(self):
        return '<University %r>' %self.univ_name

