import express, { Router } from 'express';
import {getPlaces} from "./src/controllers/places/PlacesController";

const api:Router = express.Router()


api.get("/places/list", getPlaces);

export default api;