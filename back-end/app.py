from flask import Flask
from main import app


@app.route("/")
def hello_world():
    return "<h1> hello world <h1 />"


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
