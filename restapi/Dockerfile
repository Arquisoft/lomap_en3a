FROM node:18.13.0
LABEL org.opencontainers.image.source https://github.com/Arquisoft/lomap_en3a
COPY . /app
WORKDIR /app
#Install the dependencies
RUN npm install
#Create an optimized version of the webapp
RUN npm run build
#CMD [ "npm", "start" ]
CMD [ "node", "server.js" ]