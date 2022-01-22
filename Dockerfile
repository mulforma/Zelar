FROM node:17-alpine

WORKDIR /projects/bot/

COPY package*.json ./

RUN apk --no-cache add make python3 g++ gcc

RUN npm install

COPY . .

CMD ["npm", "start"]