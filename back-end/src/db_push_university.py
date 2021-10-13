import json
import csv
import models
import urllib

def map_ownership (self, integer):
    if integer == 1:
        return "Public"
    elif integer == 2:
        return "Private Non-Profit"
    elif integer == 3:
        return "Private For-Profit"
    else:
        return "Unknown"

#maybe use this as request_url
#https://api.data.gov/ed/collegescorecard/v1/schools?api_key=how do you hide api keys&school.name=The%20University%20of%20Texas%20at%20Austin&fields=latest.school.name,latest.school.alias,latest.school.city,latest.school.state,latest.school.zip,latest.school.locale,latest.school.school_url,latest.school.carnegie_undergrad,latest.student.enrollment.undergrad_12_month,latest.student.enrollment.grad_12_month,latest.cost.tuition.in_state,latest.cost.tuition.out_of_state,latest.cost.roomboard.oncampus,latest.completion.completion_rate_4yr_150nt,latest.admissions.admission_rate.overall,latest.admissions.sat_scores.average.overall,latest.location.lat,latest.location.lon,latest.school.ownership,latest.cost.attendance.academic_year

request_url = 'https://api.data.gov/ed/collegescorecard/v1/schools?format=json&&per_page=50'
r = urllib.request.urlopen(request_url)
data = json.loads(r.read())


university_list = []
for item in data[1]:
    ownership = map_ownership(item['latest.school.ownership'])
    new_uni = University(univ_id = item['id'], univ_name = item['latest.school.name'], alias = item['latest.school.alias'], rank = 0, 
    city = item['latest.school.city'], state = item['latest.school.state'],
    zip_code = item['latest.school.zip'], school_url = item['latest.school.school_url'], locale = item['latest.school.locale'],
    longitude = 0, latitude = 0, carnegie_undergrad = item['latest.school.carnegie_undergrad'], 
    num_undergrad = item['latest.student.enrollment.undergrad_12_month'],
    num_graduate = item['latest.student.enrollment.grad_12_month'], ownership_id = ownership, mascot_name = "NaN", 
    acceptance_rate = item['latest.admissions.admission_rate.overall'], 
    graduation_rate = item['latest.completion.completion_rate_4yr_150nt'], tuition_in_st = item['latest.cost.tuition.in_state'],
    tuition_out_st = item['latest.cost.tuition.out_of_state'], avg_sat = item['latest.admissions.sat_scores.average.overall'],
    avg_cost_attendance = item['latest.cost.attendance.academic_year'])


