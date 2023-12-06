FROM node:latest
EXPOSE 8081
RUN apt update && apt install bash
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
CMD [ "npm", "start" ]