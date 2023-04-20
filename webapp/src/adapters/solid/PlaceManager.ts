import {
    buildThing,
    createSolidDataset,
    createThing, getDecimal,
    getPodUrlAll, getSolidDataset, getStringNoLocale, getThing, getThingAll,
    saveSolidDatasetAt,
    setThing, Thing,
} from "@inrupt/solid-client";
import {SCHEMA_INRUPT} from "@inrupt/vocab-common-rdf";
import Place from "../../domain/Place";
//import SolidSessionManager from "./SolidSessionManager";
import {getSessionFetch, getWebID } from './SolidSessionManager'

export default class PlaceManager {

    private readonly MAPPOINTSURL: string = "Lomap/Places";
    //private sessionManager: SolidSessionManager = SolidSessionManager.getManager();
    //TODO: BORRAR PARA LA PRÓXIMA ENTREGA
    private fakeList: Place[] = [];

    private search(lat: number, long: number): string | undefined {
        for (let i = 0; i < this.fakeList.length; i++) {
            if (this.fakeList[i].latitude == lat && this.fakeList[i].longitude == long) {
                return this.fakeList[i].uuid;
            }
        }
    }

    /**
     * It stores a Place in the POD of the current user logged in
     *
     * */
    public async createNewMapPoint(newLocation: Place): Promise<void> {
        //newLocation.uuid = crypto.randomUUID();
        this.fakeList.push(newLocation);
        const podURL = await getPodUrlAll(getWebID(), {fetch: fetch});
        try {
            await this.appendToDataSet(podURL[0] + "public/" + this.MAPPOINTSURL, newLocation);
        } catch (fe) {
            await this.createNewDataSet(podURL[0] + "public/" + this.MAPPOINTSURL, newLocation);
        }

        this.getPlacesFromMap(podURL[0] + "public/" + this.MAPPOINTSURL, "");
        this.getPlaceData(podURL[0] + "public/" + this.MAPPOINTSURL,
            newLocation.latitude, newLocation.longitude);
    }

    /**
     * It creates a new DataSet file and adds the map point
     * */
    private async createNewDataSet(podURL: string, newLocation: Place): Promise<null> {
        let courseSolidDataset = createSolidDataset();
        let placemark = buildThing(createThing({name: newLocation.uuid}))
            .addStringNoLocale(SCHEMA_INRUPT.name, newLocation.title)
            .addDecimal(SCHEMA_INRUPT.latitude, newLocation.latitude)
            .addDecimal(SCHEMA_INRUPT.longitude, newLocation.longitude)
            .addStringNoLocale(SCHEMA_INRUPT.description, newLocation.description)
            .build();
        courseSolidDataset = setThing(courseSolidDataset, placemark);
        await saveSolidDatasetAt(
            podURL,
            courseSolidDataset,
            {fetch: getSessionFetch()}// fetch from authenticated Session
        );
        return null;
    }

    /**
     * This method append the information to an existing file in the POD's user
     * */
    private async appendToDataSet(podURL: string, newLocation: Place): Promise<null> {
        let courseSolidDataset = await getSolidDataset(podURL, {fetch: this.sessionManager.getSessionFetch()});
        let placemark = buildThing(createThing({name: newLocation.uuid}))
            .addStringNoLocale(SCHEMA_INRUPT.name, newLocation.title)
            .addDecimal(SCHEMA_INRUPT.latitude, newLocation.latitude)
            .addDecimal(SCHEMA_INRUPT.longitude, newLocation.longitude)
            .addStringNoLocale(SCHEMA_INRUPT.description, newLocation.description)
            .build();
        courseSolidDataset = setThing(courseSolidDataset, placemark);
        await saveSolidDatasetAt(
            podURL,
            courseSolidDataset,
            {fetch: getSessionFetch()}// fetch from authenticated Session
        );
        return null;
    }

    /**
     * From a podURL it returns all the information from a place determined by the latitude and
     * longitude
     *
     *
     * @return The object User corresponding to the POD of the webID
     * @param podURL
     * @param lat
     * @param long
     * */
    public async getPlaceData(podURL: string, lat: number, long: number): Promise<Place> {
        let uuid = this.search(lat, long);
        //TODO: DELETE
        const podURLt = await getPodUrlAll(getWebID(), {fetch: fetch});
        let webId = podURLt + "public/" + this.MAPPOINTSURL;
        //UNTIL HERE
        let webIdDoc = await getSolidDataset(webId, {fetch: getSessionFetch()});
        let thing = getThing(webIdDoc, webId + "#" + uuid);
        let name = getStringNoLocale(<Thing>thing, SCHEMA_INRUPT.name);
        let latThing = getDecimal(<Thing>thing, SCHEMA_INRUPT.latitude);
        let longThing = getDecimal(<Thing>thing, SCHEMA_INRUPT.longitude);
        let description = getStringNoLocale(<Thing>thing, SCHEMA_INRUPT.description);
        let result = new Place(<string>name, <number>latThing, <number>longThing, <string>description, [], undefined, "no-category");
        
        return result;
    }

    /**
     * From a podURL it returns all the places stored in a concrete map
     *
     *
     * @return The object User corresponding to the POD of the webID
     * @param podURL
     * @param map
     * */
    //TODO: We must use the map parameter in the future
    public async getPlacesFromMap(podURL: string, map: string): Promise<Place[]> {
        let webIdDoc = await getSolidDataset(podURL, {fetch: getSessionFetch()});
        let things = getThingAll(webIdDoc);
        //It returns all the values in the knows property of the object Thing
        let name;
        let lat;
        let long;
        for (let i = 0; i < things.length; i++) {
            name = getStringNoLocale(<Thing>things[i], SCHEMA_INRUPT.name);
            lat = getDecimal(<Thing>things[i], SCHEMA_INRUPT.latitude);
            long = getDecimal(<Thing>things[i], SCHEMA_INRUPT.longitude);
            let description = getStringNoLocale(<Thing>things[i], SCHEMA_INRUPT.description);
            this.fakeList.push(new Place(<string>name, <number>lat, <number>long, <string>description, [], undefined,""))
        }

        
        return this.fakeList;
    }
}