import Placemark from "../domain/Placemark";

export async function getPlaces() : Promise<Placemark[]> {
    const apiEndPoint = process.env.REACT_APP_API_URI
    let response = await fetch(apiEndPoint + "/places/list");
    // let response = await fetch("https://lomapen3adeploy.qatarcentral.cloudapp.azure.com:5000/api/places/list");
    let places = new Array<Placemark>();
    if (response.status === 200) {
        let json = await response.json();
        json.forEach((place: any) => {
            places.push(new Placemark(place.latitude, place.longitude, place.title, place.placeUrl, place.category));
        });
    }
    return places;
}

export async function addPlace(place: Placemark) : Promise<boolean> {
    const apiEndPoint = process.env.REACT_APP_API_URI
    console.log(JSON.stringify({
        "longitude": place.getLng(),
        "latitude": place.getLat(),
        "title": place.getTitle(),
        "placeUrl": place.getPlaceUrl(),
        "category": place.getCategory()
    }));
    let response = await fetch(apiEndPoint + "/places/add", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            "longitude": place.getLng(),
            "latitude": place.getLat(),
            "title": place.getTitle(),
            "placeUrl": place.getPlaceUrl(),
            "category": place.getCategory()
        })
    });
    return response.status === 200;
}

export async function deletePlace(title: string) : Promise<boolean> {
    const apiEndPoint = process.env.REACT_APP_API_URI
    let response = await fetch(apiEndPoint + "/places/delete/" + title);
    return response.status === 200;
}

export async function updatePlace(title: string, place: Placemark) : Promise<boolean> {
    const apiEndPoint = process.env.REACT_APP_API_URI
    let response = await fetch(apiEndPoint + "/places/update/" + title, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            "longitude": place.getLng(),
            "latitude": place.getLat(),
            "title": place.getTitle(),
            "placeUrl": place.getPlaceUrl(),
            "category": place.getCategory()
        })
    });
    return response.status === 200;
}

export async function findPlaceByTitle(title: string) : Promise<Placemark> {
    const apiEndPoint = process.env.REACT_APP_API_URI
    let response = await fetch(apiEndPoint + "/places/get/" + title);
    return response.json();
}