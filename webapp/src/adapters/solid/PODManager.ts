import { QueryEngine } from '@comunica/query-sparql-solid';
import { saveSolidDatasetAt, SolidDataset } from '@inrupt/solid-client';
import Map from '../../domain/Map';
import Assembler from './Assembler';
import SolidSessionManager from './SolidSessionManager';
import Placemark from '../../domain/Placemark';
import Place from '../../domain/Place';

export default class PODManager {
    private sessionManager: SolidSessionManager  = SolidSessionManager.getManager();


    public async savePlace(place:Place): Promise<boolean> {
        let path:string = this.getBaseUrl() + '/data/places/' + place.uuid;

        return this.saveDataset(path, Assembler.placeToDataset(place))
            .then(() => {return true})
            .catch(() => {return false});
    }

    /**
     * Saves a map to the user's POD
     * 
     * @param map the map to be saved
     * @returns wether the map could be saved
     */
    public async saveMap(map:Map): Promise<boolean> {
        let path:string = this.getBaseUrl() + '/data/maps/' + map.getId();

        return this.saveDataset(path, Assembler.mapToDataset(map))
            .then(() => {return true})
            .catch(() => {return false});
    }

    public async loadPlacemarks(map: Map): Promise<void> {
        console.log("Load placemarks")
        let path:string = this.getBaseUrl() + '/data/maps/' + map.getId();

        let placemarks = await this.getPlacemarks(path);
        map.setPlacemarks(placemarks);
        console.log("Finish load placemarks")
    }

    /**
     * Returns the details of all the maps of the user.
     * The placemarks will not be loaded.
     * 
     * @returns an array of maps containing the details to be displayed as a preview
     */
    public async getAllMaps(): Promise<Array<Map>> {
        console.log("Get map details")
        let path:string = this.getBaseUrl() + '/data/maps/';

        let urls = await this.getContainedUrls(path);
        let maps = await this.getMapPreviews(urls);
        return maps;
    }

    /**
     * Returns the urls of all the resources in the given path
     * 
     * @param path the path in which the urls will be searched
     * @returns the urls of all the resources in the given path
     */
    private async getContainedUrls(path: string): Promise<any[]> {
        let engine = new QueryEngine();
        let query = `
            PREFIX ldp: <http://www.w3.org/ns/ldp#>
            SELECT ?content
            WHERE {
                <${path}> ldp:contains ?content .
            }
        `;
        let result = await engine.queryBindings(query, this.getQueryContext([path]));

        return await result.toArray().then(r => {
            return r.map(binding => binding.get("content"));
        });
    }

    /**
     * Maps the given urls to Map objects
     * 
     * @param urls the urls of the map datasets
     * @returns an array of Map objects with the details of each map
     */
    private async getMapPreviews(urls: Array<string>): Promise<Array<Map>> {
        let engine = new QueryEngine();
        let query = `
            PREFIX schema: <http://schema.org/>
            SELECT ?id ?name ?desc
            WHERE {
                ?details ?p ?o .    
                ?details schema:identifier ?id .
                ?details schema:name ?name .
                ?details schema:description ?desc .  
            }
        `;
        let result = await engine.queryBindings(query, this.getQueryContext(urls));
        return await result.toArray().then(r => {return Assembler.toMapPreviews(r);});
    }

    private async getPlacemarks(mapURL:string): Promise<Array<Placemark>> {
        let engine = new QueryEngine();
        let query = `
            PREFIX schema: <http://schema.org/>
            SELECT ?title ?lat ?lng
            WHERE {
                ?placemark ?p ?o .    
                ?placemark schema:name ?title .
                ?placemark schema:latitude ?lat .
                ?placemark schema:longitude ?lng .  
            }
        `;
        let result = await engine.queryBindings(query, this.getQueryContext([mapURL]));
        return await result.toArray().then(r => {return Assembler.toPlacemarkArray(r);});
    }

    /**
     * @param sources the sources for the SPARQL query
     * @returns the context for the query
     */
    private getQueryContext(sources: Array<string>): any {
        return {sources: sources, fetch: this.sessionManager.getSessionFetch() }
    }

    /**
     * Saves a dataset in the user's POD
     * 
     * @param path the URI of the dataset
     * @param dataset the dataset to be saved
     */
    private async saveDataset(path:string, dataset:SolidDataset): Promise<void> {
        let fetch = this.sessionManager.getSessionFetch();
        await saveSolidDatasetAt(path, dataset, {fetch: fetch});
    }

    /**
     * Returns the root url of a POD
     * 
     * @param webID the webID of the POD's user
     * @returns the root URL of the POD
     */
    public getBaseUrl(webID:string=''): string {
        if (webID === '') {
            webID = this.sessionManager.getWebID();
        }
        return webID.slice(0, webID.indexOf('/profile/card#me')) + '/lomap';
    }

}