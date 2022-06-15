FROM node:17-alpine

WORKDIR /projects/bot/

COPY package*.json ./

RUN apk --no-cache add make python3 g++ gcc \
    && npm install pnpm -g

COPY . .

CMD ["pnpm", "start"]
