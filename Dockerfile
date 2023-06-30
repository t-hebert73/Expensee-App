FROM node:18.16-buster-slim

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

RUN apt-get update && apt-get install curl -y

COPY . ./

EXPOSE 5173

CMD npm run dev