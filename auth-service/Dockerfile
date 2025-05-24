FROM node:18
WORKDIR /app/auth-service
COPY package*.json ./
RUN npm install --only=prod
COPY . .
EXPOSE 3001
CMD ["node", "index.js"]
