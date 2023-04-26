FROM node:18-alpine
COPY . /app
WORKDIR /app
RUN npm install --only=prod
RUN npm run build
CMD node server.js