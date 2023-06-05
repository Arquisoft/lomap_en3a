FROM node:18.13.0
LABEL org.opencontainers.image.source=https://github.com/Arquisoft/lomap_en3a
COPY . /app
WORKDIR /app
#Install the dependencies
RUN npm install

ENV REACT_APP_API_URI=defaultURI

#Create an optimized version of the webapp
RUN npm run build

#Execute npm run prod to run the server
#CMD [ "npm", "run", "prod" ]
CMD node server.js