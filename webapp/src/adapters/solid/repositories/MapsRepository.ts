import Assembler from "../Assembler";
import Map from '../../../domain/Map';
import AbstractSolidRepository from "./AbstractSolidRepository";
import { QueryEngine } from "@comunica/query-sparql-solid";
import Placemark from "../../../domain/Placemark";

export default class MapsRepository extends AbstractSolidRepository {
    
    /**
     * Saves a map to the user's POD
     * 
     * @param map the map to be saved
     * @returns wether the map could be saved
     */
    public async saveMap(map:Map): Promise<void> {
        let path = this.getBaseUrl() + '/data/maps/' + map.getId();
        await this.saveDataset(path, Assembler.mapToDataset(map), true);
        /*
        let userMaps = this.getBaseUrl() + '/user/maps';
        let urlThing = Assembler.urlToReference(path);

        await getSolidDataset(userMaps, this.fetch)
            .then(async dataset => {
                await this.saveDataset(userMaps, setThing(dataset, urlThing));
            }).catch(async () => {
                await this.saveDataset(userMaps, setThing(createSolidDataset(), urlThing));
            });
        */
    }

    /**
     * Adds the placemarks stored in the POD to their map
     * 
     * @param map the map whose placemarks will be loaded 
     * @param author the webID of the creator of the map
     */
    public async loadPlacemarks(map: Map, author:string=""): Promise<void> {
        let path:string = this.getBaseUrl(author) + '/data/maps/' + map.getId();
        let placemarks = await this.getPlacemarks(path);
        map.setPlacemarks(placemarks);
    }

    /**
     * Returns the details of all the maps of the user.
     * The placemarks will not be loaded.
     * 
     * @param user the webID of the owner of the maps
     * @returns an array of maps containing the details to be displayed as a preview
     */
    public async getAllMaps(user:string=""): Promise<Array<Map>> {
        let path:string = this.getBaseUrl(user) + '/data/maps/';

        let urls = await this.getContainedUrls(path);
        let maps = await this.getMapPreviews(urls);
        return maps;
    } 

    /**
     * Maps the given urls to Map objects
     * 
     * @param urls the urls of the map datasets
     * @returns an array of Map objects with the details of each map
     */
    public async getMapPreviews(urls: Array<string>): Promise<Array<Map>> {
        let engine = new QueryEngine();
        let query = `
            PREFIX schema: <http://schema.org/>
            SELECT DISTINCT ?id ?name ?desc
            WHERE {  
                ?details schema:identifier ?id ;
                         schema:name ?name ;
                         schema:description ?desc .  
            }
        `;
        let result = await engine.queryBindings(query, this.getQueryContext(urls));
        return await result.toArray().then(r => {return Assembler.toMapPreviews(r);});
    }

    private async getPlacemarks(mapURL:string): Promise<Array<Placemark>> {
        let engine = new QueryEngine();
        let query = `
            PREFIX schema: <http://schema.org/>
            SELECT DISTINCT ?title ?lat ?lng ?placeUrl ?cat
            WHERE {
                ?placemark schema:name ?title ;
                           schema:latitude ?lat ;
                           schema:longitude ?lng ;  
                           schema:url ?placeUrl ; 
                           schema:description ?cat . 
            }
        `;
        let result = await engine.queryBindings(query, this.getQueryContext([mapURL]));
        return await result.toArray().then(r => {return Assembler.toPlacemarkArray(r);});
    }
}