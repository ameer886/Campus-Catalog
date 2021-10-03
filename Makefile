.DEFAULT_GOAL := all
MAKEFLAGS 	  += --no-builtin-rules
SHELL		  := bash

docker-frontend:
	cd front-end && docker build -t front-end .; docker run -it -p 3000:3000 front-end

all:

clean:
	rm -f *.tmp
	rm -rf __pycache__

status:
	make clean
	@echo
	git branch
	git remote -v
	git status
	
