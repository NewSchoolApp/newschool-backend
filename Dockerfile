FROM node:12.20.1-alpine

WORKDIR /usr/app

COPY package*.json ./

RUN npm install -g @nestjs/cli
RUN npm install -g typeorm
RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "run", "start:dev"]
