var fs = require('fs');
var https = require('https');
const express = require('express');
const path = require('path');
const cors = require("cors");
const bp = require("body-parser");
const api = require("./api");

var app = express();
const port = 5000;

//Load certificates
var privateKey  = fs.readFileSync('claves/privkey.pem');
var certificate = fs.readFileSync('claves/fullchain.pem');
var credentials = {key: privateKey, cert: certificate};

//This will make sure that we will serve everything through https
app.all('*', function(req, res, next){
    if (req.secure) {
        return next();
    }
    res.redirect('https://'+req.hostname + ":" + port + req.url);
});

const metricsMiddleware: RequestHandler = promBundle({ includeMethod: true });
app.use(metricsMiddleware);

app.use(cors());
app.use(bp.json());

app.use("/api", api)
const mongoose = require("mongoose")
const db_uri = require("./settings");
const uri: string = db_uri;
const options = { useNewUrlParser: true, useUnifiedTopology: true};
mongoose.connect(uri, options).then(
    () => console.log("Database is listening")).catch((error: Error) =>
                                                          console.log("Error while connecting to the database:" + error))

// app.listen(port, ():void => {
//     console.log('Restapi listening on '+ port);
// }).on("error",(error:Error)=>{
//     console.error('Error occured: ' + error.message);
// });

var httpsServer = https.createServer(credentials, app);
httpsServer.listen(port, (): void => {
    console.log("Restapi listening on " + port);
})
.on("error", (error: Error) => {
    console.error("Error occured: " + error.message);
});