FROM node:12

RUN mkdir -p /app/
WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . ./

CMD [ "npm", "start" ]