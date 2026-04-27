<<<<<<< Updated upstream
FROM node:18-alpine
WORKDIR /app/server
COPY package*.json ./
=======
FROM node:22-alpine
WORKDIR /app
COPY server/package*.json ./
>>>>>>> Stashed changes
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "run", "dev"]