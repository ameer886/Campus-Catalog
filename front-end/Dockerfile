FROM node:14

COPY package.json package.json

RUN npm install --silent

COPY . .

CMD ["npm", "start"]
