import request, {Response} from 'supertest';
import express, { Application } from 'express';
import * as http from 'http';
import bp from 'body-parser';
import cors from 'cors';
import api from '../api';
import Placemark from '../src/models/Placemark';
import Place from "../src/models/Place";
import * as mongoose from "mongoose";
import { Document } from "mongoose";

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
        expect(response.body[0].placeUrl.length).toBeGreaterThan(0);
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
        let placeUrl:string = 'https://lomapen3a.inrupt.net/profile/card#me'
        let longitude:number = 4.56
        let latitude:number = 7.35
        let category:string = 'TestCategory'
        const response:Response = await request(app).post('/api/places/add')
            .send({title: title, placeUrl: placeUrl, longitude: longitude, latitude: latitude, category: category}).set('Accept', 'application/json')
        expect(response.statusCode).toBe(200);

        //After adding it, we should find it on the database
        let place = await Place.findOne({title: title}) as Placemark;
        expect(place.title).toBe(title);
        expect(place.placeUrl).toBe(placeUrl);
        expect(place.category).toBe(category);

        await Place.deleteOne({title: title});
    });

    /**
     * Incorrect creation of a place (empty title)
     */
    it('cannot be created correctly (empty title)', async () => {
        let title:string = ''
        let placeUrl:string = 'https://lomapen3a.inrupt.net/profile/card#me'
        let longitude:number = 4.56
        let latitude:number = 7.35
        let category:string = 'TestCategory'
        const response:Response = await request(app).post('/api/places/add')
            .send({title: title, placeUrl: placeUrl, longitude: longitude, latitude: latitude, category: category}).set('Accept', 'application/json')
        //After trying to add it, we should get an error telling about an invalid value for title
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('errors[0].param', "title")
        expect(response.body).toHaveProperty('errors[0].msg', "Title must be provided and it cannot be empty")
    });

    /**
     * Incorrect creation of a place (empty placeUrl)
     */
    it('cannot be created correctly (empty placeUrl)', async () => {
        let title:string = 'IncorrectPlace'
        let placeUrl:string = ''
        let longitude:number = 18.22
        let latitude:number = 25.98
        let category:string = 'TestCategory'
        const response:Response = await request(app).post('/api/places/add')
            .send({title: title, placeUrl: placeUrl, longitude: longitude, latitude: latitude, category:category}).set('Accept', 'application/json')
        //After trying to add it, we should get an error telling about an invalid value for placeUrl
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('errors[0].param', "placeUrl")
        expect(response.body).toHaveProperty('errors[0].msg', "Pod placeUrl must be provided and it cannot be empty")
    });

    /**
     * Incorrect creation of a place (invalid coordinates, outside both lower and upper limits)
     
    it('cannot be created correctly (invalid coordinates)', async () => {
        let title:string = 'IncorrectPlace'
        let placeUrl:string = 'placeUrl1'
        let longitude:number = -181
        let latitude:number = -91
        let response:Response = await request(app).post('/api/places/add')
            .send({title: title, placeUrl: placeUrl, longitude: longitude, latitude: latitude}).set('Accept', 'application/json')
        /* After trying to add it, we should get two errors telling about invalid values, one for latitude, the other
        for longitude
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('errors[0].param', "longitude")
        expect(response.body).toHaveProperty('errors[0].msg', "Longitude must be between -180 and 180")
        expect(response.body).toHaveProperty('errors[1].param', "latitude")
        expect(response.body).toHaveProperty('errors[1].msg', "Latitude must be between -90 and 90")

        longitude = 181
        latitude = 91
        response = await request(app).post('/api/places/add')
            .send({title: title, placeUrl: placeUrl, longitude: longitude, latitude: latitude}).set('Accept', 'application/json')
        //Both coordinates still have invalid values, we should get the same errors
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('errors[0].param', "longitude")
        expect(response.body).toHaveProperty('errors[0].msg', "Longitude must be between -180 and 180")
        expect(response.body).toHaveProperty('errors[1].param', "latitude")
        expect(response.body).toHaveProperty('errors[1].msg', "Latitude must be between -90 and 90")
    });
    */

    /**
     * Correct deletion of a place
     */
    it('can be deleted correctly', async () => {
        let title:string = 'TestPlace'
        let placeUrl:string = 'https://lomapen3a.inrupt.net/profile/card#me'
        let longitude:number = 4.56
        let latitude:number = 7.35
        // We check the added place is on the database
        let placeRes: Document<unknown, {}, Placemark> = await Place.create({title: title, placeUrl: placeUrl, longitude: longitude, latitude: latitude}) as Document<unknown, {}, Placemark>
        let place = placeRes.toObject() as Placemark
        expect(place.title).toBe(title);
        expect(place.placeUrl).toBe(placeUrl);

        //After deleting it, we should not find it afterwards
        const response:Response = await request(app).get('/api/places/delete/'+ title)
            .send({title: title, placeUrl: placeUrl, longitude: longitude, latitude: latitude}).set('Accept', 'application/json')
        expect(response.statusCode).toBe(200);
        place = await Place.findOne({title: title}) as Placemark
        expect(place).toBeNull();
    });

    /**
     * Correct update of a user
     */
    it('can be updated correctly', async () => {
        let title:string = 'OriginalPlace'
        let placeUrl:string = 'originalPlaceUrl'
        let longitude:number = 1
        let latitude:number = 1
        // We demonstrate that, at this point, the place has the original values
        let placeRs: Document<unknown, {}, Placemark> = await Place.create({title: title, placeUrl: placeUrl, longitude: longitude, latitude: latitude}) as Document<unknown, {}, Placemark>
        let place = placeRs.toObject() as Placemark
        expect(place.title).toBe(title);
        expect(place.placeUrl).toBe(placeUrl);

        let updatedTitle:string = 'UpdatedPlace'
        let updatedUuid:string = 'updatedPlaceUrl'
        let updatedLongitude:number = 20
        let updatedLatitude:number = 20
        //After updating it, it should have the new values
        const response:Response = await request(app).post('/api/places/update/'+ title)
            .send({title: updatedTitle, placeUrl: updatedUuid, longitude: updatedLongitude, latitude: updatedLatitude}).set('Accept', 'application/json')
        expect(response.statusCode).toBe(200);

        let updatedPlace: Placemark = await Place.findOne({title: updatedTitle}) as Placemark
        expect(updatedPlace.title).toBe(updatedTitle);
        expect(updatedPlace.placeUrl).toBe(updatedUuid);

        await Place.deleteOne({title: updatedTitle});
    });


    /**
     * Incorrect update of a place (invalid values)
     */
    it('cannot be updated correctly (invalid values)', async () => {
        let title:string = ''
        let placeUrl:string = ''
        let longitude:number = -181
        let latitude:number = -91
        let response:Response = await request(app).post('/api/places/update/Brussels town hall')
            .send({title: title, placeUrl: placeUrl, longitude: longitude, latitude: latitude}).set('Accept', 'application/json')
        //After trying to update it, we should get an error for each incorrect field
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('errors[0].param', "title")
        expect(response.body).toHaveProperty('errors[0].msg', "Title cannot be empty")
        expect(response.body).toHaveProperty('errors[1].param', "placeUrl")
        expect(response.body).toHaveProperty('errors[1].msg', "Pod placeUrl cannot be empty")
        //expect(response.body).toHaveProperty('errors[2].param', "longitude")
        //expect(response.body).toHaveProperty('errors[2].msg', "Longitude must be between -180 and 180")
        //expect(response.body).toHaveProperty('errors[3].param', "latitude")
        //expect(response.body).toHaveProperty('errors[3].msg', "Latitude must be between -90 and 90")
        /*
        longitude = 181
        latitude = 91
        response = await request(app).post('/api/places/add')
            .send({title: title, placeUrl: placeUrl, longitude: longitude, latitude: latitude}).set('Accept', 'application/json')
        //Both coordinates still have invalid values, we should get the same errors for them
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('errors[2].param', "longitude")
        expect(response.body).toHaveProperty('errors[2].msg', "Longitude must be between -180 and 180")
        expect(response.body).toHaveProperty('errors[3].param', "latitude")
        expect(response.body).toHaveProperty('errors[3].msg', "Latitude must be between -90 and 90")
        */
    });
});