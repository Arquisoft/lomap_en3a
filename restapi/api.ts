import express, { Router } from 'express';
import {getPlaces, addPlace, deletePlace} from "./src/controllers/places/PlacesController";

const api:Router = express.Router()


api.get("/places/list", getPlaces);
api.post("/places/add", addPlace);
api.get("/places/delete/:title", deletePlace);

export default api;