import {Request, Response} from "express";
import {PlaceType} from "../../types/PlaceType";
import Place from "../../models/Place";

const getPlaces = async (req: Request, res: Response): Promise<void> => {
    try {
        const places: Array<PlaceType> = await Place.find();
        res.send(places);
    }
    catch (error) {
        console.log("An error has occurred while retrieving the list of places: " + error)
    }
}

const addPlace = async (req: Request, res: Response): Promise<void> => {
    try {
        await Place.create({
            title: req.body.title,
            uuid: req.body.uuid,
            longitude: req.body.longitude,
            latitude: req.body.latitude
        });
        res.sendStatus(200)
    }
    catch (error) {
        console.log("An error has occurred while adding a place with title " + req.params.title + ": " + error)
    }
}

const deletePlace = async (req: Request, res: Response): Promise<void> => {
    try {
        await Place.deleteOne({title: req.params.title})
        res.sendStatus(200)
    }
    catch (error) {
        console.log("An error has occurred while deleting a place with title " + req.params.title + ": " + error)
    }
}

const updatePlace = async (req: Request, res: Response): Promise<void> => {
    try {
        await Place.findOneAndUpdate({title: req.params.title}, {
            title: req.body.title,
            uuid: req.body.uuid,
            longitude: req.body.longitude,
            latitude: req.body.latitude
        });
        res.sendStatus(200)
    }
    catch (error) {
        console.log("An error has occurred while updating a place with title " + req.params.title + ": " + error)
    }
}
export { getPlaces, addPlace, deletePlace, updatePlace }