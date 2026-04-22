FROM node:20-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm install
COPY server . 
COPY shared ../shared
EXPOSE 5000
CMD ["npm", "run", "dev"]
