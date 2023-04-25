FROM node:18.13
COPY . /app
WORKDIR /app
RUN npm install
RUN npm run build
CMD node server.js