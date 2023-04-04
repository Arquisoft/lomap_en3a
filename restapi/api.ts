import express, { Request, Response, Router } from 'express';
import {check} from 'express-validator';
import {getPlaces} from "./src/controllers/places/PlacesController";

const api:Router = express.Router()


api.get("/places/list", getPlaces);

export default api;