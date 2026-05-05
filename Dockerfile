FROM node:20-alpine

WORKDIR /app

COPY backend/ ./

RUN npm ci && npm run build

EXPOSE 4000

CMD ["node", "dist/index.js"]
