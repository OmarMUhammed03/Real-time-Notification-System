FROM node:18
WORKDIR /app/user-service
COPY package*.json ./
RUN npm install --only=prod
COPY . .
EXPOSE 3002
CMD ["node", "index.js"]
