import json
import csv

import urllib
from dotenv import load_dotenv, find_dotenv
import os
from db import db_init
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, Column, String, Integer, MetaData

def map_ownership (num):
    if num == 1:
        return "Public"
    elif num == 2:
        return "Private Non-Profit"
    elif num == 3:
        return "Private For-Profit"
    else:
        return "Unknown"

def rank_search(college, city, state):
    term = college
    reader = csv.reader(open('supp_data/rank_data.csv', 'r'))
    for row in reader:
        if row[0] == term or (row[1] == city and row[2] ==  state and row[0][:6] in term):
            return int(row[3])
    return 0

app = Flask(__name__)
db = db_init(app)

from models import University

load_dotenv(find_dotenv())
university_list = []
page_num = 0

request_url = 'https://api.data.gov/ed/collegescorecard/v1/schools?api_key=' + os.getenv("COLLEGESCORECARD_API_KEY") + '&page=0&fields=id,latest.school.name,latest.school.alias,latest.school.city,latest.school.state,latest.school.zip,latest.school.locale,latest.school.school_url,latest.school.carnegie_undergrad,latest.student.enrollment.undergrad_12_month,latest.student.enrollment.grad_12_month,latest.cost.tuition.in_state,latest.cost.tuition.out_of_state,latest.cost.roomboard.oncampus,latest.completion.completion_rate_4yr_150nt,latest.admissions.admission_rate.overall,latest.admissions.sat_scores.average.overall,latest.location.lat,latest.location.lon,latest.school.ownership,latest.cost.attendance.academic_year,location.lat,location.lon'
r = urllib.request.urlopen(request_url)
data = json.loads(r.read())
#find how many pages of the api we need to traverse
page_limit = data['metadata']['total'] // data['metadata']['per_page']
if(data['metadata']['total'] % data['metadata']['per_page'] != 0):
    page_limit += 1

while page_num < page_limit:
    for item in data['results']:
        college_rank = rank_search(item['latest.school.name'], item['latest.school.city'], state = item['latest.school.state'])
        new_uni = University(univ_id = item['id'], univ_name = item['latest.school.name'], alias = item['latest.school.alias'], rank = college_rank, 
        city = item['latest.school.city'], state = item['latest.school.state'],
        zip_code = item['latest.school.zip'], school_url = item['latest.school.school_url'], locale = item['latest.school.locale'],
        longitude = item['location.lon'], latitude = item['location.lat'], carnegie_undergrad = item['latest.school.carnegie_undergrad'], 
        num_undergrad = item['latest.student.enrollment.undergrad_12_month'],
        num_graduate = item['latest.student.enrollment.grad_12_month'], ownership_id = item['latest.school.ownership'], mascot_name = "NaN", 
        acceptance_rate = item['latest.admissions.admission_rate.overall'], 
        graduation_rate = item['latest.completion.completion_rate_4yr_150nt'], tuition_in_st = item['latest.cost.tuition.in_state'],
        tuition_out_st = item['latest.cost.tuition.out_of_state'], avg_sat = item['latest.admissions.sat_scores.average.overall'],
        avg_cost_attendance = item['latest.cost.attendance.academic_year'])
        university_list.append(new_uni)

    page_num += 1
    #we only do another request if we need another page
    if(page_num < page_limit):
        request_url = 'https://api.data.gov/ed/collegescorecard/v1/schools?api_key=' + os.getenv("COLLEGESCORECARD_API_KEY") + '&page=' + str(page_num) +'&fields=id,latest.school.name,latest.school.alias,latest.school.city,latest.school.state,latest.school.zip,latest.school.locale,latest.school.school_url,latest.school.carnegie_undergrad,latest.student.enrollment.undergrad_12_month,latest.student.enrollment.grad_12_month,latest.cost.tuition.in_state,latest.cost.tuition.out_of_state,latest.cost.roomboard.oncampus,latest.completion.completion_rate_4yr_150nt,latest.admissions.admission_rate.overall,latest.admissions.sat_scores.average.overall,latest.location.lat,latest.location.lon,latest.school.ownership,latest.cost.attendance.academic_year,location.lat,location.lon'
        r = urllib.request.urlopen(request_url)
        data = json.loads(r.read())

db.create_all()
#db.session.query(univ).filter(univ.c.univ_id == 228778).delete()
db.session.add_all(university_list)
db.session.commit()

