import {
    buildThing,
    createSolidDataset,
    createThing, getInteger,
    getPodUrlAll, getSolidDataset,
    getStringNoLocale, getThingAll,
    saveSolidDatasetAt,
    setThing,
    Thing
} from "@inrupt/solid-client";
import {SCHEMA_INRUPT} from "@inrupt/vocab-common-rdf";
import SolidSessionManager from "./SolidSessionManager";

export default class MapPointManager {

    private readonly MAPPOINTSURL: string = "LoMap/MapPoints";
    private sessionManager: SolidSessionManager = SolidSessionManager.getManager();

    /**
     * It stores a MapPoint in the POD of the current user logged in
     *
     * */
    public async createNewMapPoint(newLocation: MapPoint): Promise<void> {
        const podURL = await getPodUrlAll(this.sessionManager.getWebID(), {fetch: fetch});
        this.createNewDataSet(podURL[0] + "public/" + this.MAPPOINTSURL, newLocation);
    }

    private async createNewDataSet(podURL: string, newLocation: MapPoint) : Promise<null>{
        let courseSolidDataset = createSolidDataset();
        let placemark = buildThing(createThing({name: crypto.randomUUID()}))
            .addStringNoLocale(SCHEMA_INRUPT.name, newLocation.getTitle())
            .addInteger(SCHEMA_INRUPT.latitude, newLocation.getLat())
            .addInteger(SCHEMA_INRUPT.longitude, newLocation.getLng())
            .build();
        courseSolidDataset = setThing(courseSolidDataset, placemark);
        const savedSolidDataset = await saveSolidDatasetAt(
            podURL,
            courseSolidDataset,
            {fetch: this.sessionManager.getSessionFetch()}// fetch from authenticated Session
        );
        return null;
    }

    private async appendToDataSet(podURL: string, newLocation: MapPoint): Promise<null>{
        let courseSolidDataset = await getSolidDataset(podURL, { fetch: this.sessionManager.getSessionFetch()});
        let placemark = buildThing(createThing({name: crypto.randomUUID()}))
            .addStringNoLocale(SCHEMA_INRUPT.name, newLocation.getTitle())
            .addInteger(SCHEMA_INRUPT.latitude, newLocation.getLat())
            .addInteger(SCHEMA_INRUPT.longitude, newLocation.getLng())
            .build();
        courseSolidDataset = setThing(courseSolidDataset, placemark);
        const savedSolidDataset = await saveSolidDatasetAt(
            podURL,
            courseSolidDataset,
            {fetch: this.sessionManager.getSessionFetch()}// fetch from authenticated Session
        );
        return null;
    }

    /**
     * From a webID it returns all the information from a person in a User object
     *
     * @param webID A string identifying the pod of a user
     *
     * @return The object User corresponding to the POD of the webID
     * */
    public async getMapPointData(webID: string): Promise<MapPoint> {
        const podURL = await getPodUrlAll(this.sessionManager.getWebID(), {fetch: fetch});
        let webId = podURL + "public/MapPoints";
        let webIdDoc = await getSolidDataset(webId, {fetch: this.sessionManager.getSession().fetch});
        let friends = getThingAll(webIdDoc);
        //It returns all the values in the knows property of the object Thing
        let name = getStringNoLocale(<Thing>friends[0], SCHEMA_INRUPT.name);
        let lat = getInteger(<Thing>friends[0], SCHEMA_INRUPT.latitude);
        let long = getInteger(<Thing>friends[0], SCHEMA_INRUPT.longitude);
        // return new Placemark(name, webID);
        return new Placemark(<number>lat, <number>long, <string>name);
    }
}