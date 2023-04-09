import express, { Application, RequestHandler } from "express";
import cors from 'cors';
import bp from 'body-parser';
import promBundle from 'express-prom-bundle';
import api from "./api";

const app: Application = express();
const port: number = 5000;

const mongoose = require("mongoose")
const uri: string = "mongodb+srv://lomapen3a:HkO74fQ5tNY8gvfj@lomapen3a.sscscjd.mongodb.net/lomapen3a?retryWrites=true&w=majority";
const options = { useNewUrlParser: true, useUnifiedTopology: true};
mongoose.connect(uri, options).then(
    () => console.log("Database is listening")).catch((error: Error) =>
    console.log("Error while connecting to the database:" + error))

const metricsMiddleware:RequestHandler = promBundle({includeMethod: true});
app.use(metricsMiddleware);

app.use(cors());
app.use(bp.json());

app.use("/api", api)

app.listen(port, ():void => {
    console.log('Restapi listening on '+ port);
}).on("error",(error:Error)=>{
    console.error('Error occured: ' + error.message);
});

