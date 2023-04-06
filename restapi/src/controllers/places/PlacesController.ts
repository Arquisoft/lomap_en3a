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
        const place = new Place({
            title: req.body.title,
            uuid: req.body.uuid,
            longitude: req.body.longitude,
            latitude: req.body.latitude
        });
        await place.save();
        res.sendStatus(200)
    }
    catch (error) {
        console.log("An error has occurred while adding a place: " + error)
    }
}

const deletePlace = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log(req.params.title)
        await Place.deleteOne({title: req.params.title})
        res.sendStatus(200)
    }
    catch (error) {
        console.log("An error has occurred while adding a place: " + error)
    }
}
export { getPlaces, addPlace, deletePlace }