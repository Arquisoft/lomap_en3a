import express, { Router } from 'express';
import {getPlaces, addPlace} from "./src/controllers/places/PlacesController";

const api:Router = express.Router()


api.get("/places/list", getPlaces);
api.post("/places/add", addPlace);

export default api;