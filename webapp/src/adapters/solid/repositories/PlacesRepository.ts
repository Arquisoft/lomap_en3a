import { createSolidDataset } from "@inrupt/solid-client";
import Place from "../../../domain/Place";
import Assembler from "../Assembler";
import AbstractSolidRepository from "./AbstractSolidRepository";
import { QueryEngine } from "@comunica/query-sparql-solid";

export default class PlacesRepository extends AbstractSolidRepository {

    /**
     * Retrieves a place from the given url
     * 
     * @param url the url of the place
     * @returns the Place object
     */
    public async getPlace(url:string): Promise<Place> {
        return (await this.getPlacesFromUrls([url]))[0]; 
    }

    /**
     * Retrieves all the available places of a user
     * 
     * @param webID the webID of the user
     * @returns all the available places
     */
    public async getAllUserPlaces(webID:string=""): Promise<Place[]> {
        let urls = await this.getContainedUrls(this.getBaseUrl(webID)+'/data/places/');
        return await this.getPlacesFromUrls(urls);
    }

    /**
     * Saves a place on the user data folder
     * @param place the place to be saved
     */
    public async savePlace(place:Place): Promise<void> {
        let path:string = this.getBaseUrl() + '/data/places/' + place.uuid;

        await this.saveDataset(path+"/details", Assembler.placeToDataset(place));
        await this.saveDataset(path+"/comments", createSolidDataset(), true);
        await this.saveDataset(path+"/images", createSolidDataset(), true);
        await this.saveDataset(path+"/reviews", createSolidDataset(), true);
        await this.createAcl(path+'/');
        this.setPublicAccess(this.getBaseUrl()+'/data/places/', true);
    }

    /**
     * Changes the public access permissions for a place
     * @param place 
     * @param isPublic 
     */
    public async changePlacePublicAccess(place:Place, isPublic:boolean) {
        let path:string = this.getBaseUrl() + '/data/places/' + place.uuid;

        await this.setPublicAccess(path+"/", isPublic);
        for (let dataset of ['/images', '/comments', '/reviews']) {
            await this.setPublicAccess(path + dataset, true, true);
        }
    }


    private async getPlacesFromUrls(urls:string[]): Promise<Place[]> {
        let engine = new QueryEngine();
        engine.invalidateHttpCache();
        let query = `
            PREFIX schema: <http://schema.org/>
            SELECT DISTINCT ?title ?desc ?lat ?lng ?id
            WHERE {
                ?place schema:name ?title ;
                       schema:description ?desc ;
                       schema:latitude ?lat ;
                       schema:longitude ?lng ;  
                       schema:identifier ?id .  
            }
        `;
        let result = await engine.queryBindings(query, this.getQueryContext(urls.map(url => url+"/details")));

        let places:Place[] = []
        await result.toArray().then(r => {
            r.forEach(binding =>places.push( Assembler.toPlace(binding) ));
        });
        return places;
    }
    
}