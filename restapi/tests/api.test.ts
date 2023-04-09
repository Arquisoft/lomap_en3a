import request, {Response} from 'supertest';
import express, { Application } from 'express';
import * as http from 'http';
import bp from 'body-parser';
import cors from 'cors';
import api from '../api';
import {PlaceType} from "../src/types/PlaceType";
import Place from "../src/models/Place";
import * as mongoose from "mongoose";

let app:Application;
let server:http.Server;

beforeAll(async () => {
    app = express();
    const port: number = 5000;
    const options: cors.CorsOptions = {
        origin: ['http://localhost:3000']
    };
    app.use(cors(options));
    app.use(bp.json());
    app.use("/api", api)

    server = app.listen(port, ():void => {
        console.log('Restapi server for testing listening on '+ port);
    }).on("error",(error:Error)=>{
        console.error('Error occured: ' + error.message);
    });

    await mongoose.connect("mongodb+srv://lomapen3a:HkO74fQ5tNY8gvfj@lomapen3a.sscscjd.mongodb.net/lomapen3a?retryWrites=true&w=majority");
});

afterAll(async () => {
    server.close() //close the server
    await mongoose.disconnect();
})

describe('place ', () => {

    jest.setTimeout(8000);

    /**
     * Listing places without errors
     */
    it('listing places',async () => {
        const response:Response = await request(app).get("/api/places/list");
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0].title.length).toBeGreaterThan(0);
        expect(response.body[0].uuid.length).toBeGreaterThan(0);
        expect(response.body[0].longitude).toBeGreaterThan(-180);
        expect(response.body[0].longitude).toBeLessThan(180);
        expect(response.body[0].latitude).toBeGreaterThan(-90);
        expect(response.body[0].latitude).toBeLessThan(90);
    });

    /**
     * Correct creation of a user
     */
    it('can be created correctly', async () => {
        let title:string = 'TestPlace'
        let uuid:string = 'https://lomapen3a.inrupt.net/profile/card#me'
        let longitude:number = 4.56
        let latitude:number = 7.35
        const response:Response = await request(app).post('/api/places/add')
            .send({title: title, uuid: uuid, longitude: longitude, latitude: latitude}).set('Accept', 'application/json')
        expect(response.statusCode).toBe(200);

        let place: PlaceType = await Place.findOne({title: title}) as PlaceType;
        expect(place.title).toBe(title);
        expect(place.uuid).toBe(uuid);
        expect(place.longitude).toBe(longitude);
        expect(place.latitude).toBe(latitude);

        await Place.deleteOne({title: title});
    });
});