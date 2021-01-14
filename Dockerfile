FROM node:12.20.1-alpine

WORKDIR /usr/app

COPY package*.json ./

RUN npm install -g @nestjs/cli
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
