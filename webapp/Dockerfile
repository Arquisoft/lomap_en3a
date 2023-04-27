FROM node:18.13.0
LABEL org.opencontainers.image.source https://github.com/Arquisoft/lomap_en3a
COPY . /app
WORKDIR /app
#Install the dependencies
RUN npm install

ARG API_URI="http://20.21.124.62:5000/api"
ENV REACT_APP_API_URI=$API_URI

#Create an optimized version of the webapp
RUN npm run build -v ./privkey.pem:/app/privkey.pem azureuser_webapp_1
RUN npm run build -v ./fullchain.pem:/app/fullchain.pem azureuser_webapp_1

#Execute npm run prod to run the server
#CMD [ "npm", "run", "prod" ]
#CMD ["npm", "start"]
CMD ["node", "./src/server.js"]