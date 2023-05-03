import express, { Application, RequestHandler } from "express";
import cors from 'cors';
import bp from 'body-parser';
import promBundle from 'express-prom-bundle';
import api from "./api";
import db_uri from "./settings";
import { readFileSync } from "fs";
import { createServer } from "https"

const app: Application = express();
const portHttp: number = 5000;
const portHttps: number = 5000;

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

try {
    let privateKey = readFileSync("claves/privkey.pem");
    let certificate = readFileSync("claves/fullchain.pem");
    let credentials = { key: privateKey, cert: certificate };

    app.all('*', function(req, res, next){
        if (req.secure) {
            return next();
        }
        res.redirect('https://'+req.hostname + req.url);
    });

    createServer(credentials, app)
        .listen(portHttps, (): void => {
            console.log("Restapi listening on " + portHttps);
        })
        .on("error", (error: Error) => {
            console.error("Error occured: " + error.message);
        });
} catch (e) {

    app
        .listen(portHttp, (): void => {
            console.log("Restapi listening on " + portHttp);
        })
        .on("error", (error: Error) => {
            console.error("Error occured: " + error.message);
        });
}

