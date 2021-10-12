import json
import csv
import models
import urllib

request_url = 'https://api.data.gov/ed/collegescorecard/v1/schools?format=json&&per_page=50'
r = urllib.request.urlopen(request_url)
data = json.loads(r.read())


university_list = []

