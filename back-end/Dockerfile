FROM nikolaik/python-nodejs

COPY . .

RUN pip3 install -r requirements.txt

ENTRYPOINT [ "python3" ]
CMD ["src/unit_test.py"]