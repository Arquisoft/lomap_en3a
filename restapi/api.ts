import express, { Router } from 'express';
import {getPlaces, addPlace, deletePlace, updatePlace, findPlaceByTitle} from "./src/controllers/places/PlacesController";
import {addPlaceChecks, deletePlaceChecks, updatePlaceChecks, findPlaceByTitleChecks} from "./src/controllers/checks"

const api:Router = express.Router()


api.get("/places/list", getPlaces);
api.post("/places/add", addPlaceChecks, addPlace);
api.get("/places/delete/:title", deletePlaceChecks, deletePlace);
api.post("/places/update/:title", updatePlaceChecks, updatePlace);
api.get("/places/get/:title", findPlaceByTitleChecks, findPlaceByTitle);

export default api;