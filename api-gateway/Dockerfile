FROM node:18
WORKDIR /app/api-gateway
COPY package*.json ./
RUN npm install --only=prod
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]
