import { QueryEngine } from "@comunica/query-sparql-solid";
import Group from "../../../domain/Group";
import User from "../../../domain/User";
import Assembler from "../Assembler";
import Map from '../../../domain/Map';
import AbstractSolidRepository from "./AbstractSolidRepository";
import { SolidDataset, buildThing, createThing, getSolidDataset, getThing, setThing } from "@inrupt/solid-client";
import { RDFS } from "@inrupt/vocab-common-rdf";

export default class GroupsRepository extends AbstractSolidRepository {

    /**
     * Returns the group stored in the given url
     * @param groupUrl the url of the group
     * @returns the group object
     */
    public async getGroup(groupUrl: string): Promise<Group> {
        return (await this.getGroupsFromUrls([groupUrl]))[0];
    }

    /**
     * Retrieves all the groups of the user
     * @returns the groups of the user
     */
    public async getAllUserGroups(): Promise<Group[]> {
        let urls = await this.getContainedUrls(this.getBaseUrl()+'/groups');
        return await this.getGroupsFromUrls(urls);
    }

    /**
     * Creates the friends group with the inrupt friends
     */
    public async createFriendsGroup(): Promise<void> {
        let users: User[] = await this.friends.getFriendsList();
        let group = new Group("Friends", users); 
        let groupsPath = this.getBaseUrl() + "/groups";

        await this.saveDataset(groupsPath+"/friends", Assembler.groupToDataset(group));
    }

    /**
     * Creates a new group in the PODs of all its members
     * @param group the group to be stored in the PODs
     */
    public async createGroup(group: Group) {
        let webID = this.sessionManager.getWebID();
        let dataset = Assembler.groupToDataset(group);
        await this.createGroupForUser(new User("", webID), group, dataset);

        group.getMembers()
                .filter(member => member.getWebId() !== webID)
                .forEach(user => this.createGroupForUser(user, group, dataset));
    }

    /**
     * Stores a map in the group maps thing
     * @param map the map to be stored
     * @param group the group of the map
     */
    public async storeMapInGroup(map:Map, group:Group) {
        let url = this.getBaseUrl() + "/data/maps/" + map.getId();
        let otherMembers = group.getMembers().filter(m => m.getWebId() !== this.sessionManager.getWebID());
        let newGroup = new Group(group.getName(), otherMembers, group.getId());

        await this.setGroupAccess(url, newGroup, {read:true, write:true});
        await this.insertMapReferences(url, group);
    }

    /**
     * Returns the urls of all the maps of the group
     * @param group the group whose maps will be retrieved
     * @returns the urls of the maps
     */
    public async getGroupMapUrls(group: Group): Promise<string[]> {
        let webIDs = group.getMembers().map(m => m.getWebId());
        let groupUrls = webIDs.map( id => this.getBaseUrl(id)+"/groups/"+group.getId() );

        let engine = new QueryEngine();
        engine.invalidateHttpCache();
        let query = `
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            SELECT DISTINCT ?mapUrl
            WHERE {   
                ?bag rdfs:member ?mapUrl .
            } 
        `;
        let result = await engine.queryBindings(query, this.getQueryContext(groupUrls));

        return await result.toArray().then(r => {
            return r.map(binding => binding.get("mapUrl")?.value as string);
        });
    }

    
    private async createGroupForUser(user:User, group:Group, dataset:SolidDataset|undefined = undefined) {
        let path = this.getBaseUrl(user.getWebId()) + "/groups/" + group.getId();
        let groupDataset = dataset || Assembler.groupToDataset(group);
        await this.saveDataset(path, groupDataset);
    }

    private async getGroupsFromUrls(urls:string[]) {
        let engine = new QueryEngine();
        engine.invalidateHttpCache();
        let query = `
            PREFIX vcard: <http://www.w3.org/2006/vcard/ns#>
            SELECT DISTINCT ?name ?id (GROUP_CONCAT(DISTINCT ?member; SEPARATOR=",") AS ?members)
            WHERE {   
                ?group vcard:Name ?name;
                       vcard:hasUID ?id ;
                       vcard:hasMember ?member .
            } 
            GROUP BY ?name ?id
        `;
        let result = await engine.queryBindings(query, this.getQueryContext(urls));

        let groups:Group[] = []
        await result.toArray().then(r => {
            r.forEach(binding =>groups.push( Assembler.toGroup(binding) ));
        });
        return groups;
    }

    private async insertMapReferences(mapUrl:string, group:Group): Promise<void> {
        let url = this.getBaseUrl()+'/groups/'+group.getId();
        let dataset = await getSolidDataset(url, this.fetch);
        let maps = getThing(dataset, url+"#maps");
        dataset = setThing(dataset, buildThing(maps||createThing())
            .addStringNoLocale(RDFS.member, mapUrl)
            .build());

        await this.saveDataset(url, dataset);
    }
}