FROM node:18.13.0
LABEL org.opencontainers.image.source https://github.com/Arquisoft/lomap_en3a
COPY . /app
WORKDIR /app
#Install the dependencies
RUN npm install
CMD [ "npm", "run", "prod" ]
#CMD [ "npm", "start" ]