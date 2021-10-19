from flask import Flask
from db import db_init
from models import University, Housing, Amenities

app = Flask(__name__)
db = db_init(app)

@app.route('/')
def home():
    return 'hello world'

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)