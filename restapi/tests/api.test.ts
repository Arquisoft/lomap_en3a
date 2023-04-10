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

    jest.setTimeout(12000);

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
     * Correct creation of a place
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
     * Incorrect creation of a place (empty title)
     */
    it('cannot be created correctly (empty title)', async () => {
        let title:string = ''
        let uuid:string = 'https://lomapen3a.inrupt.net/profile/card#me'
        let longitude:number = 4.56
        let latitude:number = 7.35
        const response:Response = await request(app).post('/api/places/add')
            .send({title: title, uuid: uuid, longitude: longitude, latitude: latitude}).set('Accept', 'application/json')
        //After trying to add it, we should get an error telling about an invalid value for title
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('errors[0].param', "title")
        expect(response.body).toHaveProperty('errors[0].msg', "Title must be provided and it cannot be empty")
    });

    /**
     * Incorrect creation of a place (empty uuid)
     */
    it('cannot be created correctly (empty uuid)', async () => {
        let title:string = 'IncorrectPlace'
        let uuid:string = ''
        let longitude:number = 18.22
        let latitude:number = 25.98
        const response:Response = await request(app).post('/api/places/add')
            .send({title: title, uuid: uuid, longitude: longitude, latitude: latitude}).set('Accept', 'application/json')
        //After trying to add it, we should get an error telling about an invalid value for uuid
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('errors[0].param', "uuid")
        expect(response.body).toHaveProperty('errors[0].msg', "Pod uuid must be provided and it cannot be empty")
    });

    /**
     * Incorrect creation of a place (invalid coordinates, outside both lower and upper limits)
     */
    it('cannot be created correctly (invalid coordinates)', async () => {
        let title:string = 'IncorrectPlace'
        let uuid:string = 'uuid1'
        let longitude:number = -181
        let latitude:number = -91
        let response:Response = await request(app).post('/api/places/add')
            .send({title: title, uuid: uuid, longitude: longitude, latitude: latitude}).set('Accept', 'application/json')
        /* After trying to add it, we should get two errors telling about invalid values, one for latitude, the other
        for longitude*/
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('errors[0].param', "longitude")
        expect(response.body).toHaveProperty('errors[0].msg', "Longitude must be between -180 and 180")
        expect(response.body).toHaveProperty('errors[1].param', "latitude")
        expect(response.body).toHaveProperty('errors[1].msg', "Latitude must be between -90 and 90")

        longitude = 181
        latitude = 91
        response = await request(app).post('/api/places/add')
            .send({title: title, uuid: uuid, longitude: longitude, latitude: latitude}).set('Accept', 'application/json')
        //Both coordinates still have invalid values, we should get the same errors
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('errors[0].param', "longitude")
        expect(response.body).toHaveProperty('errors[0].msg', "Longitude must be between -180 and 180")
        expect(response.body).toHaveProperty('errors[1].param', "latitude")
        expect(response.body).toHaveProperty('errors[1].msg', "Latitude must be between -90 and 90")
    });

    /**
     * Correct deletion of a place
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
        // We demonstrate that, at this point, the place has the original values
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


    /**
     * Incorrect update of a place (invalid values)
     */
    it('cannot be updated correctly (invalid values)', async () => {
        let title:string = ''
        let uuid:string = ''
        let longitude:number = -181
        let latitude:number = -91
        let response:Response = await request(app).post('/api/places/update/Brussels town hall')
            .send({title: title, uuid: uuid, longitude: longitude, latitude: latitude}).set('Accept', 'application/json')
        //After trying to update it, we should get an error for each incorrect field
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('errors[0].param', "title")
        expect(response.body).toHaveProperty('errors[0].msg', "Title cannot be empty")
        expect(response.body).toHaveProperty('errors[1].param', "uuid")
        expect(response.body).toHaveProperty('errors[1].msg', "Pod uuid cannot be empty")
        expect(response.body).toHaveProperty('errors[2].param', "longitude")
        expect(response.body).toHaveProperty('errors[2].msg', "Longitude must be between -180 and 180")
        expect(response.body).toHaveProperty('errors[3].param', "latitude")
        expect(response.body).toHaveProperty('errors[3].msg', "Latitude must be between -90 and 90")

        longitude = 181
        latitude = 91
        response = await request(app).post('/api/places/add')
            .send({title: title, uuid: uuid, longitude: longitude, latitude: latitude}).set('Accept', 'application/json')
        //Both coordinates still have invalid values, we should get the same errors for them
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('errors[2].param', "longitude")
        expect(response.body).toHaveProperty('errors[2].msg', "Longitude must be between -180 and 180")
        expect(response.body).toHaveProperty('errors[3].param', "latitude")
        expect(response.body).toHaveProperty('errors[3].msg', "Latitude must be between -90 and 90")
    });
});