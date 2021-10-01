FROM node:latest

COPY package.json package.json

RUN npm install --silent

COPY . .

CMD ["npm", "start"]
