FROM node:18.13.0
LABEL org.opencontainers.image.source=https://github.com/Arquisoft/lomap_en3a
COPY . /app
WORKDIR /app
#Install the dependencies
RUN npm install

ARG API_URI
ENV REACT_APP_API_URI=${API_URI}

#Create an optimized version of the webapp
RUN npm run build

#Execute npm run prod to run the server
#CMD [ "npm", "run", "prod" ]
CMD node server.js
#CMD ["sh", "-c", "echo 'REACT_APP_API_URI=$DEPLOY_HOST' > .env && node server.js"]