FROM node:alpine

WORKDIR /app

COPY . .

EXPOSE 3000

RUN npm install -g npm@10.5.1

RUN npm install


CMD [ "npm","run","dev" ]