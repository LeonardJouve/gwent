FROM node:alpine as builder

WORKDIR /app

RUN apk update && apk add build-base g++ cairo-dev pango-dev giflib-dev libjpeg-turbo-dev

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run generate
RUN npm run build

FROM node:alpine
WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

CMD ["npm", "run", "start"]
