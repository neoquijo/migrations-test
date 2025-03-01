FROM node:18-alpine
WORKDIR /app
RUN apk add --no-cache postgresql-client

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

COPY saferun.sh .
RUN chmod +x saferun.sh

EXPOSE 3000

CMD ["./saferun.sh"]
