FROM python:3.8

RUN apt-get update 
RUN apt-get install -y fonts-liberation libasound2 libatk-bridge2.0-0 libatspi2.0-0 libdrm2 libgbm1 libgtk-3-0 libnspr4 libnss3 libxkbcommon0 libxshmfence1 libu2f-udev libnss3 libvulkan1

#download and install chrome
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN dpkg -i google-chrome-stable_current_amd64.deb; apt-get -fy install

#some envs
ENV APP_HOME /app 
ENV PORT 5000

#set workspace
WORKDIR ${APP_HOME}

#copy local files
COPY . . 

# CMD exec gunicorn --bind :${PORT} --workers 1 --threads 8 main:app 
CMD bash
