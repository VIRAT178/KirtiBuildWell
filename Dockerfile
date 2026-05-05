FROM node:20-alpine

WORKDIR /app

COPY backend/ ./

RUN npm install && npm run build

EXPOSE 4000

CMD ["node", "dist/index.js"]
