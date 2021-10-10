.DEFAULT_GOAL := all
MAKEFLAGS 	  += --no-builtin-rules
SHELL		  := bash
ENV_FILE	  := ../.env

docker-frontend:
	cd front-end && docker build -t front-end .; docker run -it -p 3000:3000 front-end

docker-backend:
	cd back-end && docker build -t back-end .; docker run -it --env-file $(ENV_FILE) -p 5000:5000 back-end
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
	
