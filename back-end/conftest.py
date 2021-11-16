import os
import pytest

from main import app
from flask import Flask

@pytest.fixture
def client():
    app.config['TESTING'] = True

    with app.test_client() as client:
        yield client
    