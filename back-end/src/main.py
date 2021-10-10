from flask import Flask
from models import app, University

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)