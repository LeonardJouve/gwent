FROM node:alpine

WORKDIR /app

RUN apk update && apk add build-base

COPY . .

RUN npm install
RUN npm run build

CMD ["npm", "run", "start"]
