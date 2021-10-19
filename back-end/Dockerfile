FROM nikolaik/python-nodejs

COPY . .

RUN pip3 install --upgrade pip

RUN pip3 install -r requirements.txt

WORKDIR /test

RUN python3 -m unit_test

WORKDIR /../src

CMD ["python3", "main.py"]