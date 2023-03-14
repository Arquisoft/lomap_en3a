import {
    addUrl,
    buildThing,
    createSolidDataset,
    getSolidDataset,
    getStringNoLocale,
    getThing,
    getUrlAll, saveSolidDatasetAt, setThing,
    Thing
} from "@inrupt/solid-client";
import UuidGenerator from "@inrupt/solid-client-authn-browser/dist/util/UuidGenerator";
import {createThing} from "@inrupt/solid-client/umd";
import {FOAF, RDF} from "@inrupt/vocab-common-rdf";
import Placemark from "../../domain/Placemark";
import SolidSessionManager from "./SolidSessionManager";

export default class MapPointManager {

    private sessionManager: SolidSessionManager = SolidSessionManager.getManager();

    /**
     * Ir searches all the friends related with the person logged in stored in the card from its POD
     *
     * @return A list of User objects representing friends
     * */
    public async createNewMapPoint(newLocation: Placemark): Promise<void> {
        let courseSolidDataset = createSolidDataset();
        let placemark = buildThing(createThing({name: crypto.randomUUID()}))
            .addStringNoLocale(FOAF.name, "hola")
            .addUrl(RDF.type, "https://schema.org/Book")
            .build();
        setThing(courseSolidDataset, placemark);
        const savedSolidDataset = await saveSolidDatasetAt(
            "https://pelayorg.inrupt.net/public/Writing101",
            courseSolidDataset,
            { fetch: fetch }             // fetch from authenticated Session
        );
    }

    /**
     * From a webID it returns all the information from a person in a User object
     *
     * @param webID A string identifying the pod of a user
     *
     * @return The object User corresponding to the POD of the webID
     * */
    public async getMapPointData(webID: string): Promise<User> {
        let webId = webID + "profile/card";
        let webIdDoc = await getSolidDataset(webId);
        let friends = getThing(webIdDoc, webId + "#me");
        //It returns all the values in the knows property of the object Thing
        let name = getStringNoLocale(<Thing>friends, FOAF.name);
        return new User(name, webID);
    }
}