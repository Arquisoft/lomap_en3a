import {Request, Response} from "express";
import {PlaceType} from "../../types/PlaceType";
import Place from "../../models/Place";
import {validationResult} from "express-validator";

const getPlaces = async (req: Request, res: Response): Promise<Response> => {
    try {
        const places: Array<PlaceType> = await Place.find();
        return res.status(200).send(places);
    }
    catch (error) {
        return res.status(500).send("An error has occurred while retrieving the list of places: \n\n" + error)
    }
}

const addPlace = async (req: Request, res: Response): Promise<Response> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }
        await Place.create({
            title: req.body.title,
            uuid: req.body.uuid,
            longitude: req.body.longitude,
            latitude: req.body.latitude
        });
        return res.sendStatus(200)
    }
    catch (error) {
        return res.status(500).send("An error has occurred while adding a place: " + error)
    }
}

const deletePlace = async (req: Request, res: Response): Promise<Response> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }
        await Place.deleteOne({title: req.params.title})
        return res.sendStatus(200)
    }
    catch (error) {
        return res.status(500).send("An error has occurred while deleting a place with title " +
            req.params.title + ": " + error)
    }
}

const updatePlace = async (req: Request, res: Response): Promise<Response> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }
        await Place.findOneAndUpdate({title: req.params.title}, {
            title: req.body.title,
            uuid: req.body.uuid,
            longitude: req.body.longitude,
            latitude: req.body.latitude
        });
        return res.sendStatus(200)
    }
    catch (error) {
        return res.status(500).send("An error has occurred while updating a place with title " +
            req.params.title + ": " + error)
    }
}

const findPlaceByTitle = async (req: Request, res: Response): Promise<Response> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }
        const place = await Place.findOne({title: req.params.title});
        return res.status(200).send(place);
    }
    catch (error) {
        return res.status(500).send("An error has occurred while updating a place with title " +
            req.params.title + ": " + error)
    }
}
export { getPlaces, addPlace, deletePlace, updatePlace, findPlaceByTitle }