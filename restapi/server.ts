import express, { Application, RequestHandler } from "express";
import cors from 'cors';
import bp from 'body-parser';
import promBundle from 'express-prom-bundle';
import fs from "fs";
import https from "https";
import api from "./api";
import db_uri from "./settings";

const app: Application = express();
const port: number = 5000;

//Load certificates
var privateKey  = fs.readFileSync('claves/alice.key');
var certificate = fs.readFileSync('claves/alice.crt');
var credentials = {key: privateKey, cert: certificate};

//This will make sure that we will serve everything through https
app.all('*', function(req, res, next){
    if (req.secure) {
        return next();
    }
    res.redirect('https://'+req.hostname + ":" + port + req.url);
});

const mongoose = require("mongoose")
const uri: string = db_uri;
const options = { useNewUrlParser: true, useUnifiedTopology: true};
mongoose.connect(uri, options).then(
    () => console.log("Database is listening")).catch((error: Error) =>
    console.log("Error while connecting to the database:" + error))

const metricsMiddleware:RequestHandler = promBundle({includeMethod: true});
app.use(metricsMiddleware);

app.use(cors());
app.use(bp.json());

app.use("/api", api)

// app.listen(port, ():void => {
//     console.log('Restapi listening on '+ port);
// }).on("error",(error:Error)=>{
//     console.error('Error occured: ' + error.message);
// });

var httpsServer = https.createServer(credentials, app);
httpsServer.listen(port)
// httpsServer.listen(port, (): void => {
//     console.log("Restapi listening on " + port);
// })
//     .on("error", (error: Error) => {
//         console.error("Error occured: " + error.message);
//     });