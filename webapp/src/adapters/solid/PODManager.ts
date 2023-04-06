import { saveSolidDatasetAt, SolidDataset } from '@inrupt/solid-client';
import Map from '../../domain/Map';
import Assembler from './Assembler';
import SolidSessionManager from './SolidSessionManager';
import Placemark from '../../domain/Placemark';

export default class PODManager {
    private sessionManager: SolidSessionManager  = SolidSessionManager.getManager();

    /**
     * Saves a map to the user's POD
     * 
     * @param map the map to be saved
     * @returns wether the map could be saved
     */
    public async saveMap(map:Map): Promise<boolean> {
        let path:string = this.getBaseUrl() + '/data/maps/' + map.getId();

        return this.saveDataset(path, Assembler.toDataset(map))
            .then(() => {return true})
            .catch(() => {return false});
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
    private getBaseUrl(webID:string=''): string {
        if (webID === '') {
            webID = this.sessionManager.getWebID();
        }
        return webID.slice(0, webID.indexOf('/profile/card#me')) + '/lomap';
    }

}