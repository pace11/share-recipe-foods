FROM node:22.14.0-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev
COPY . .

COPY .env .env

RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]
