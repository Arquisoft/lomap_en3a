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

    jest.setTimeout(15000);

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

        //After adding it, we should find it on the database
        let place: PlaceType = await Place.findOne({title: title}) as PlaceType;
        expect(place.title).toBe(title);
        expect(place.uuid).toBe(uuid);
        expect(place.longitude).toBe(longitude);
        expect(place.latitude).toBe(latitude);

        await Place.deleteOne({title: title});
    });

    /**
     * Incorrect creation of a user (empty title)
     */
    it('cannot be created correctly (empty title)', async () => {
        let title:string = ''
        let uuid:string = 'https://lomapen3a.inrupt.net/profile/card#me'
        let longitude:number = 4.56
        let latitude:number = 7.35
        const response:Response = await request(app).post('/api/places/add')
            .send({title: title, uuid: uuid, longitude: longitude, latitude: latitude}).set('Accept', 'application/json')
        expect(response.statusCode).toBe(400);
    });

    /**
     * Correct deletion of a user
     */
    it('can be deleted correctly', async () => {
        let title:string = 'TestPlace'
        let uuid:string = 'https://lomapen3a.inrupt.net/profile/card#me'
        let longitude:number = 4.56
        let latitude:number = 7.35
        // We check the added place is on the database
        let place: PlaceType = await Place.create({title: title, uuid: uuid, longitude: longitude, latitude: latitude}) as PlaceType
        expect(place.title).toBe(title);
        expect(place.uuid).toBe(uuid);
        expect(place.longitude).toBe(longitude);
        expect(place.latitude).toBe(latitude);

        //After deleting it, we should not find it afterwards
        const response:Response = await request(app).get('/api/places/delete/'+ title)
            .send({title: title, uuid: uuid, longitude: longitude, latitude: latitude}).set('Accept', 'application/json')
        expect(response.statusCode).toBe(200);
        place = await Place.findOne({title: title}) as PlaceType
        expect(place).toBeNull();
    });

    /**
     * Correct update of a user
     */
    it('can be updated correctly', async () => {
        let title:string = 'OriginalPlace'
        let uuid:string = 'originalUuid'
        let longitude:number = 1
        let latitude:number = 1
        // We demonstrate that, at this point, we have the original values
        let place: PlaceType = await Place.create({title: title, uuid: uuid, longitude: longitude, latitude: latitude}) as PlaceType
        expect(place.title).toBe(title);
        expect(place.uuid).toBe(uuid);
        expect(place.longitude).toBe(longitude);
        expect(place.latitude).toBe(latitude);

        let updatedTitle:string = 'UpdatedPlace'
        let updatedUuid:string = 'updatedUuid'
        let updatedLongitude:number = 20
        let updatedLatitude:number = 20
        //After updating it, it should have the new values
        const response:Response = await request(app).post('/api/places/update/'+ title)
            .send({title: updatedTitle, uuid: updatedUuid, longitude: updatedLongitude, latitude: updatedLatitude}).set('Accept', 'application/json')
        expect(response.statusCode).toBe(200);

        let updatedPlace: PlaceType = await Place.findOne({title: updatedTitle}) as PlaceType
        expect(updatedPlace.title).toBe(updatedTitle);
        expect(updatedPlace.uuid).toBe(updatedUuid);
        expect(updatedPlace.longitude).toBe(updatedLongitude);
        expect(updatedPlace.latitude).toBe(updatedLatitude);

        await Place.deleteOne({title: updatedTitle});
    });
});