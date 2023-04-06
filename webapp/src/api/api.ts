import {PlaceType} from "../types/PlaceType";

export async function getPlaces() : Promise<PlaceType[]> {
    const apiEndPoint = "http://localhost:5000/api"
    let response = await fetch(apiEndPoint + "/places/list");
    return response.json();
}