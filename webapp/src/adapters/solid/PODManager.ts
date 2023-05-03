import Map from '../../domain/Map';
import Place from '../../domain/Place';
import PlaceComment from '../../domain/place/PlaceComment';
import PlaceRating from '../../domain/place/PlaceRating';
import Group from '../../domain/Group';
import PlacesRepository from './repositories/PlacesRepository';
import InteractionsRepository from './repositories/InteractionsRepository';
import MapsRepository from './repositories/MapsRepository';
import GroupsRepository from './repositories/GroupsRepository';
import { createContainerAt, getSolidDataset } from '@inrupt/solid-client';
import SolidSessionManager from './SolidSessionManager';

export default class PODManager {

    private maps: MapsRepository = new MapsRepository();
    private places: PlacesRepository = new PlacesRepository();
    private interactions: InteractionsRepository = new InteractionsRepository();
    private groups: GroupsRepository = new GroupsRepository();


    public async init(): Promise<void> {
        let fetch = {fetch: SolidSessionManager.getManager().getSessionFetch()};
        let groupsPath = this.getBaseUrl() + "/groups/";
        let mapsPath = this.getBaseUrl() + "/data/maps/";
        let placesPath = this.getBaseUrl() + "/data/places/";

        await this.initFolder(mapsPath, fetch);
        await this.initFolder(placesPath, fetch);
        await this.createFriendsGroup();
        await this.setDefaultFolderPermissions(groupsPath, {read:true, write:true});
        await this.setPublicAccess(groupsPath, false, true);
    }

    private async initFolder(path:string, fetch:any) {
        await getSolidDataset(path, fetch)
            .then(async () => {
                await this.setPublicAccess(path, true);
            })
            .catch(async () => {
                await createContainerAt(path, fetch);
                await this.maps.createAcl(path);
                await this.setPublicAccess(path, true);
            });
    }


    // MAPS

    /**
     * Saves a map to the user's POD
     * 
     * @param map the map to be saved
     * @returns wether the map could be saved
     */
    public async saveMap(map:Map): Promise<void> {
        await this.maps.saveMap(map);
    }

    /**
     * Returns the details of all the maps of the user.
     * The placemarks will not be loaded.
     * 
     * @param user the webID of the owner of the maps
     * @returns an array of maps containing the details to be displayed as a preview
     */
    public async getAllMaps(user:string=""): Promise<Array<Map>> {
        return await this.maps.getAllMaps(user);
    } 

    /**
     * Adds the placemarks stored in the POD to their map
     * 
     * @param map the map whose placemarks will be loaded 
     * @param author the webID of the creator of the map
     */
    public async loadPlacemarks(map: Map, author:string=""): Promise<void> {
        await this.maps.loadPlacemarks(map, author);
    }


    // PLACES

    /**
     * Retrieves a place from the given url
     * 
     * @param url the url of the place
     * @returns the Place object
     */
    public async getPlace(url:string): Promise<Place> {
        return await this.places.getPlace(url);
    }

    /**
     * Retrieves all the available places of a user
     * 
     * @param webID the webID of the user
     * @returns all the available places
     */
    public async getAllUserPlaces(webID:string=""): Promise<Place[]> {
        return await this.places.getAllUserPlaces(webID);
    }

    /**
     * Saves a place on the user data folder
     * @param place the place to be saved
     */
    public async savePlace(place:Place): Promise<void> {
        let placeUrl = this.getBaseUrl() + "/data/places/" + place.uuid;
        await this.places.savePlace(place);
        place.photos.forEach(async img => await this.interactions.addImage(img, placeUrl));
    }

    /**
     * Changes the public access permissions for a place
     * @param place 
     * @param isPublic 
     */
    public async changePlacePublicAccess(place:Place, isPublic:boolean) {
        await this.places.changePlacePublicAccess(place, isPublic);
    }


    // INTERACTIONS

    /**
     * Adds a comment to a place
     * 
     * @param comment the comment to be added
     * @param placeUrl the url of the place
     */
    public async comment(comment: PlaceComment, placeUrl: string) {
        await this.interactions.comment(comment, placeUrl);
    }

    /**
     * Retrieves all the comments of a place
     * 
     * @param placeUrl the url of the place 
     * @returns the comments of the place
     */
    public async getComments(placeUrl: string): Promise<PlaceComment[]> {
        return await this.interactions.getComments(placeUrl);
    }

    /**
     * Adds a review to a place
     * 
     * @param review the review to be added 
     * @param placeUrl the url of the place
     */
    public async review(review: PlaceRating, placeUrl: string) {
        await this.interactions.review(review, placeUrl);
    }

    /**
     * Retrieves the average score of a place
     * 
     * @param placeUrl the url of the place
     * @returns the average score and number of reviews
     */
    public async getScore(placeUrl: string) {
        return await this.interactions.getScore(placeUrl);
    }

    /**
     * Adds an image to a place
     * 
     * @param image the image to be added
     * @param placeUrl the url of the place
     */
    public async addImage(image: File, placeUrl: string) {
        await this.interactions.addImage(image, placeUrl);
    }

    /**
     * Retrieves the urls of all the images of the place
     * 
     * @param placeUrl the url of the place
     * @returns the urls of the place images
     */
    public async getImageUrls(placeUrl: string) { 
        return await this.interactions.getImageUrls(placeUrl);
    }


    // GROUPS

    /**
     * Returns the group stored in the given url
     * @param groupUrl the url of the group
     * @returns the group object
     */
    public async getGroup(groupUrl: string): Promise<Group> {
        return await this.groups.getGroup(groupUrl);
    }

    /**
     * Retrieves all the groups of the user
     * @returns the groups of the user
     */
    public async getAllUserGroups(): Promise<Group[]> {
        return this.groups.getAllUserGroups();
    }

    /**
     * Creates the friends group with the inrupt friends
     */
    public async createFriendsGroup(): Promise<void> {
        await this.groups.createFriendsGroup();
    }

    /**
     * Creates a new group in the PODs of all its members
     * @param group the group to be stored in the PODs
     */
    public async createGroup(group: Group) {
        await this.groups.createGroup(group);
    }

    /**
     * Adds a new map to a group of users
     * @param map the map to be stored
     * @param group the group of the map
     */
    public async addMapToGroup(map:Map, group:Group) {
        await this.maps.saveMap(map);
        await this.groups.storeMapInGroup(map, group);
    }

    /**
     * Returns the maps of the group
     * @param group the group whose maps will be retrieved
     * @returns the mapsof the group
     */
    public async getGroupMaps(group: Group): Promise<Map[]> {
        let urls = await this.groups.getGroupMapUrls(group);
        return await this.maps.getMapPreviews(urls);
    }


    // PERMISSIONS

    /**
     * Sets the public read and write permissions of a resource
     * 
     * @param resourceUrl the url of the resource
     * @param canRead whether the resource has public read permissions
     * @param canWrite whether the resource has public write permissions
     */
    public async setPublicAccess(resourceUrl:string, canRead:boolean, canWrite:boolean=false) {
        await this.maps.setPublicAccess(resourceUrl, canRead, canWrite);
    }

    /**
     * Sets the resource permissions for all the users in the given group
     * 
     * @param resourceUrl the url of the resource
     * @param group the group of users whose permissions will be modified
     * @param permissions the new access permissions
     */
    public async setGroupAccess(resourceUrl:string, group:Group, permissions:any) {
        await this.maps.setGroupAccess(resourceUrl, group, permissions);
    }

    /**
     * Sets the default access permissions for the contents inside a folder
     * 
     * @param path the url of the folder
     * @param permissions the new default permissions
     */
    public async setDefaultFolderPermissions(path:string, permissions:any) {
        await this.maps.setDefaultFolderPermissions(path, permissions);
    }

    /**
     * Returns the root url of a POD
     * 
     * @param webID the webID of the POD's user
     * @returns the root URL of the POD
     */
    public getBaseUrl(webID:string="") {
        return this.maps.getBaseUrl(webID);
    }

}