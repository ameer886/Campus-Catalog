FROM nikolaik/python-nodejs

COPY . .

RUN pip3 install -r src/requirements.txt

ENTRYPOINT [ "python3" ]
CMD ["test/test_main.py"]