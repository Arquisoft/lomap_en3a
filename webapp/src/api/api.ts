import {PlaceType} from "../types/PlaceType";

export async function getPlaces() : Promise<PlaceType[]> {
    const apiEndPoint = "http://localhost:5000/api"
    let response = await fetch(apiEndPoint + "/places/list");
    return response.json();
}

export async function addPlace(place: PlaceType) : Promise<boolean> {
    const apiEndPoint = "http://localhost:5000/api"
    let response = await fetch(apiEndPoint + "/places/add", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            "title": place.title,
            "uuid": place.uuid,
            "longitude": place.longitude,
            "latitude": place.latitude
        })
    });
    return response.status === 200;
}

export async function deletePlace(title: string) : Promise<boolean> {
    const apiEndPoint = "http://localhost:5000/api"
    let response = await fetch(apiEndPoint + "/places/delete/" + title);
    return response.status === 200;
}

export async function updatePlace(title: string, place: PlaceType) : Promise<boolean> {
    const apiEndPoint = "http://localhost:5000/api"
    let response = await fetch(apiEndPoint + "/places/update/" + title, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            "title": place.title,
            "uuid": place.uuid,
            "longitude": place.longitude,
            "latitude": place.latitude
        })
    });
    return response.status === 200;
}

export async function findPlaceByTitle(title: string) : Promise<PlaceType> {
    const apiEndPoint = "http://localhost:5000/api"
    let response = await fetch(apiEndPoint + "/places/get/" + title);
    return response.json();
}