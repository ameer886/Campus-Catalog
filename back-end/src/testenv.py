import os
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())
print(os.getenv("COLLEGESCORECARD_API_KEY"))
