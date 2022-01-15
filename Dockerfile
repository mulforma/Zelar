FROM node:17-alpine

WORKDIR /projects/bot/

COPY package*.json ./

RUN apk --update add make python3 g++ gcc

RUN npm install

COPY . .

CMD ["node", "deploy"]

CMD ["npm", "start"]