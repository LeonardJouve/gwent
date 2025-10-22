FROM node:alpine

WORKDIR /app

RUN apk update && apk add build-base g++ cairo-dev pango-dev giflib-dev

COPY . .

RUN npm install
RUN npm run build

CMD ["npm", "run", "start"]
