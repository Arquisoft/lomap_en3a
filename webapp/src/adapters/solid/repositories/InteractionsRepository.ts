import { QueryEngine } from "@comunica/query-sparql-solid";
import PlaceComment from "../../../domain/place/PlaceComment";
import Assembler from "../Assembler";
import AbstractSolidRepository from "./AbstractSolidRepository";
import { getSolidDataset, overwriteFile, setThing } from "@inrupt/solid-client";
import PlaceRating from "../../../domain/place/PlaceRating";

export default class InteractionsRepository extends AbstractSolidRepository {

    /**
     * Adds a comment to a place
     * 
     * @param comment the comment to be added
     * @param placeUrl the url of the place
     */
    public async comment(comment: PlaceComment, placeUrl: string) {
        let commentPath: string = this.getBaseUrl() + "/data/interactions/comments/" + comment.id;
        await this.addCommentToUser(comment);
        await this.addInteractionToPlace(placeUrl+"/comments", commentPath);
    }

    /**
     * Adds a review to a place
     * 
     * @param review the review to be added 
     * @param placeUrl the url of the place
     */
    public async review(review: PlaceRating, placeUrl: string) {
        let reviewPath: string = this.getBaseUrl() + "/data/interactions/reviews/"+review.id;
        await this.addReviewToUser(review);
        await this.addInteractionToPlace(placeUrl+"/reviews", reviewPath);
    }

    /**
     * Adds an image to a place
     * 
     * @param image the image to be added
     * @param placeUrl the url of the place
     */
    public async addImage(image: File, placeUrl: string) {
        let imagePath = this.getBaseUrl() + "/data/interactions/images/" + crypto.randomUUID();
        await this.addImageToUser(image, imagePath);
        await this.addInteractionToPlace(placeUrl+"/images", imagePath)
    }

    /**
     * Retrieves all the comments of a place
     * 
     * @param placeUrl the url of the place 
     * @returns the comments of the place
     */
    public async getComments(placeUrl: string): Promise<PlaceComment[]> {
        let urls = await this.getUrlsFromDataset(placeUrl + "/comments");

        let engine = new QueryEngine();
        engine.invalidateHttpCache();

        let query = `
            PREFIX schema: <http://schema.org/>
            SELECT DISTINCT ?user ?comment ?id
            WHERE {
                ?s schema:accountId ?user ;
                   schema:description ?comment ;
                   schema:identifier ?id .
            }
        `;
        let result = await engine.queryBindings(query, this.getQueryContext(urls));
        return await result.toArray().then(r => {
            return Assembler.toPlaceComments(r);
        }); 
    }

    /**
     * Retrieves the average score of a place
     * 
     * @param placeUrl the url of the place
     * @returns the average score and number of reviews
     */
    public async getScore(placeUrl: string) {
        let urls = await this.getUrlsFromDataset(placeUrl + "/reviews");

        let engine = new QueryEngine();
        engine.invalidateHttpCache();
        let query = `
            PREFIX schema: <http://schema.org/>
            SELECT (COUNT(?user) as ?number) (AVG(?review) as ?score)
            WHERE {
                ?s schema:accountId ?user ;
                   schema:value ?review ;
                   schema:identifier ?id .
            }
        `;
        let result = await engine.queryBindings(query, this.getQueryContext(urls));
        return await result.toArray().then(r => {
            return {
                reviews: Number(r[0].get("number")?.value),
                score:   Number(r[0].get("score")?.value)
            }
        });      
    }

    /**
     * Retrieves the urls of all the images of the place
     * 
     * @param placeUrl the url of the place
     * @returns the urls of the place images
     */
    public async getImageUrls(placeUrl: string) { 
        return await this.getUrlsFromDataset(placeUrl + "/images");  
    }

    private async addInteractionToPlace(datasetUrl:string, interactionRef:string) {
        let dataset = await getSolidDataset(datasetUrl, this.fetch);
        dataset = setThing(dataset, Assembler.urlToReference(interactionRef))
        await this.saveDataset(datasetUrl, dataset);
    }

    private async addCommentToUser(comment: PlaceComment) {
        let commentPath: string = this.getBaseUrl() + "/data/interactions/comments/" + comment.id;
        await this.saveDataset(commentPath, Assembler.commentToDataset(comment), true);
        await this.setPublicAccess(commentPath, true);
    }

    private async addReviewToUser(review: PlaceRating) {
        let reviewPath: string = this.getBaseUrl() + "/data/interactions/reviews/" + review.id;
        await this.saveDataset(reviewPath, Assembler.reviewToDataset(review), true);
        await this.setPublicAccess(reviewPath, true);
    }

    private async addImageToUser(image: File, imageUrl: string) {
        try {
            await overwriteFile(
                imageUrl,
                image,
                {contentType: image.type, fetch: this.sessionManager.getSessionFetch()}
            );
            await this.createFileAcl(imageUrl)
            await this.setPublicAccess(imageUrl, true);
        } catch (err) {
            console.log(err);
        }
    }

    private async getUrlsFromDataset(datasetUrl:string): Promise<string[]> {
        let engine = new QueryEngine();
        engine.invalidateHttpCache();
        let query = `
            PREFIX schema: <http://schema.org/>
            SELECT DISTINCT ?url
            WHERE {
                ?s schema:URL ?url .
            }
        `;
        let result = await engine.queryBindings(query, this.getQueryContext([datasetUrl]));

        return await result.toArray().then(r => {
            return r.map(binding => binding.get("url")?.value as string);
        });
    }

}