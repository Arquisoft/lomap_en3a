import {Request, Response} from "express";
import Placemark from "../../models/Placemark";
import Place from "../../models/Place";
import {validationResult} from "express-validator";
import { Document } from "mongoose";

const getPlaces = async (req: Request, res: Response): Promise<Response> => {
    try {
        res.header('Access-Control-Allow-Origin', '*');
        const documents: Array<Document<unknown, {}, Placemark>> = await Promise.resolve(
            Place.find()
        );
        const places: Array<Placemark> = documents.map((doc) =>
            doc.toObject() as Placemark
        );
        return res.status(200).send(places);
    } catch (error) {
        return res
            .status(500)
            .send("An error has occurred while retrieving the list of places: \n\n" + error);
    }
}

const addPlace = async (req: Request, res: Response): Promise<Response> => {
    try {
        res.header('Access-Control-Allow-Origin', '*');
        console.log(req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }
        await Place.create({
            longitude: req.body.longitude.toString(),
            latitude: req.body.latitude.toString(),
            title: req.body.title.toString(),
            placeUrl: req.body.placeUrl.toString(),
            category: req.body.category.toString()
        });
        return res.sendStatus(200)
    }
    catch (error) {
        return res.status(500).send("An error has occurred while adding a place: " + error)
    }
};

const deletePlace = async (req: Request, res: Response): Promise<Response> => {
    try {
        res.header('Access-Control-Allow-Origin', '*');
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }
        await Promise.resolve(Place.deleteOne({title: req.params.title}))
        return res.sendStatus(200)
    }
    catch (error) {
        res.set('Content-Type', 'text/plain');
        return res.status(500).send("An error has occurred while deleting a place with title " +
            req.params.title + ": " + error)
    }
}

const updatePlace = async (req: Request, res: Response): Promise<Response> => {
    try {
        res.header('Access-Control-Allow-Origin', '*');
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }
        await Promise.resolve(Place.findOneAndUpdate({title: req.params.title}, {
            longitude: req.body.longitude,
            latitude: req.body.latitude,
            title: req.body.title,
            placeUrl: req.body.placeUrl,
            category: req.body.category,
        }));
        return res.sendStatus(200)
    }
    catch (error) {
        res.set('Content-Type', 'text/plain');
        return res.status(500).send("An error has occurred while updating a place with title " +
            req.params.title + ": " + error)
    }
}

const findPlaceByTitle = async (req: Request, res: Response): Promise<Response> => {
    try {
        res.header('Access-Control-Allow-Origin', '*');
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }
        const place = await Promise.resolve(Place.findOne({title: req.params.title}));
        return res.status(200).send(place);
    }
    catch (error) {
        res.set('Content-Type', 'text/plain');
        return res.status(500).send("An error has occurred while updating a place with title " +
            req.params.title + ": " + error)
    }
}
export { getPlaces, addPlace, deletePlace, updatePlace, findPlaceByTitle }