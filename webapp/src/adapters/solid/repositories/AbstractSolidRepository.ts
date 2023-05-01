import SolidSessionManager from '../SolidSessionManager';
import FriendManager from '../FriendManager';
import { SolidDataset, createAclFromFallbackAcl, getFallbackAcl, getFileWithAcl, getLinkedResourceUrlAll, getSolidDatasetWithAcl, saveAclFor, saveSolidDatasetAt, setPublicDefaultAccess } from '@inrupt/solid-client';
import { universalAccess as access } from "@inrupt/solid-client";
import Group from '../../../domain/Group';
import { QueryEngine } from '@comunica/query-sparql-solid';

export default abstract class AbstractSolidRepository {

    protected sessionManager: SolidSessionManager  = SolidSessionManager.getManager();
    protected friends: FriendManager = new FriendManager();
    protected fetch: any = {fetch:this.sessionManager.getSessionFetch()};


    // ACL CREATION

    /**
     * Creates a new acl for a RDF resource
     * @param path the url of the resource
     */
    public async createAcl(path:string) {
        let dataset = await getSolidDatasetWithAcl(path, this.fetch);
        await this.createNewAcl(dataset, path);
    }

    /**
     * Creates a new acl for a non RDF file
     * @param path the url of the file
     */
    public async createFileAcl(path:string) {
        let file = await getFileWithAcl(path, this.fetch);
        await this.createNewAcl(file, path);
    }

    /**
     * Creates an ACL for the given resource
     * 
     * @param resource the resource with ACL
     * @param path the url of the resource
     * @returns the new ACL
     */
    private async createNewAcl(resource:any, path:string) {
        let fallbackAcl = getFallbackAcl(resource);
        let resourceInfo = this.getResourceInfo(path, resource);

        let acl = createAclFromFallbackAcl(
            this.getResourceWithFallbackAcl(resourceInfo, fallbackAcl)
        );
        await saveAclFor({internal_resourceInfo: resourceInfo}, acl, this.fetch);
        return acl;
    }

    private getResourceInfo(path:string, resource:any) {
        let linkedResources = getLinkedResourceUrlAll(resource);
        return {
            sourceIri: path, 
            isRawData: false, 
            linkedResources: linkedResources,
            aclUrl: path + '.acl' 
        };
    }

    private getResourceWithFallbackAcl(resourceInfo:any, fallbackAcl:any):any {
        return {
            internal_resourceInfo: resourceInfo,
            internal_acl: { 
                resourceAcl: null, 
                fallbackAcl: fallbackAcl 
            }
        }
    }


    // CHANGE ACCESS PERMISSIONS

    /**
     * Sets the public read and write permissions of a resource
     * 
     * @param resourceUrl the url of the resource
     * @param canRead whether the resource has public read permissions
     * @param canWrite whether the resource has public write permissions
     */
    public async setPublicAccess(resourceUrl:string, canRead:boolean, canWrite:boolean=false) {
        await access.setPublicAccess(
            resourceUrl,
            { read: canRead, write: canWrite },
            this.fetch,
        );
    }

    /**
     * Sets the resource permissions for all the users in the given group
     * 
     * @param resourceUrl the url of the resource
     * @param group the group of users whose permissions will be modified
     * @param permissions the new access permissions
     */
    public async setGroupAccess(resourceUrl:string, group:Group, permissions:any) {

        for (let user of group.getMembers()) {
            await access.setAgentAccess(resourceUrl, user.getWebId(), permissions, this.fetch);
        }
    }

    /**
     * Sets the default access permissions for the contents inside a folder
     * 
     * @param path the url of the folder
     * @param permissions the new default permissions
     */
    public async setDefaultFolderPermissions(path:string, permissions:any) {
        let folder = await getSolidDatasetWithAcl(path, this.fetch);
        let acl = await this.createNewAcl(folder, path);

        acl = setPublicDefaultAccess(acl, permissions);
        await saveAclFor({internal_resourceInfo: this.getResourceInfo(path,folder)}, acl, this.fetch);  
    }


    // UTILITIES

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

    /**
     * Saves a dataset in the user's POD
     * 
     * @param path the URI of the dataset
     * @param dataset the dataset to be saved
     */
    protected async saveDataset(path:string, dataset:SolidDataset, createAcl:boolean=false): Promise<void> {
        await saveSolidDatasetAt(path, dataset, this.fetch);
        if (createAcl) {
            await this.createAcl(path);
        }
    }

    /**
     * Returns the urls of all the resources in the given path
     * 
     * @param path the path in which the urls will be searched
     * @returns the urls of all the resources in the given path
     */
    protected async getContainedUrls(path: string): Promise<any[]> {
        let engine = new QueryEngine();
        engine.invalidateHttpCache();
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
     * @param sources the sources for the SPARQL query
     * @returns the context for the query
     */
    protected getQueryContext(sources: Array<string>): any {
        return {sources: sources, fetch: this.sessionManager.getSessionFetch() }
    }

}