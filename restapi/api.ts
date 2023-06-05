import express, {Router} from 'express';
import {
    addPlaceChecks,
    deletePlaceChecks,
    findPlaceByTitleChecks,
    updatePlaceChecks
} from "./src/controllers/checks"
import {
    addPlace,
    deletePlace,
    findPlaceByTitle,
    getPlaces,
    updatePlace
} from "./src/controllers/places/PlacesController";

const api:Router = express.Router()

// api.use(
//     cors({
//         credentials: true,
//         origin: ["https://20.168.251.141", "https://lomapen3a.cloudns.ph", "https://localhost",
//             "https://20.168.251.141:443", "https://lomapen3a.cloudns.ph:443", "https://localhost:443"],
//         allowedHeaders: ["Content-Type", "Authorization"],
//         preflightContinue: true,
//     })
// );

api.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "POST, GET, DELETE, UPDATE, PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, " +
        "Accept");
    // Debemos especificar todas las headers que se aceptan. Content-Type , token
    next();
});

api.get("/places/list", getPlaces);
api.post("/places/add", addPlaceChecks, addPlace);
api.get("/places/delete/:title", deletePlaceChecks, deletePlace);
api.post("/places/update/:title", updatePlaceChecks, updatePlace);
api.get("/places/get/:title", findPlaceByTitleChecks, findPlaceByTitle);

export default api;