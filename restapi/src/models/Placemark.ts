export default class Placemark {
    public lng: number;
    public lat: number;
    public title: string;
    public placeUrl: string;
    public category: string;

    public constructor(lat:number, lng:number, title:string="", placeUrl:string="", category:string="") {
        this.lat = lat;
        this.lng = lng;
        this.title = title;
        this.placeUrl = placeUrl;
        this.category = category
    }

    public getLng(): number {
        return this.lng;
    }
    public getLat(): number {
        return this.lat;
    }
    public getTitle(): string {
        return this.title;
    }
    public getPlaceUrl(): string {
        return this.placeUrl;
    }
    public setPlaceUrl(url:string): void {
        this.placeUrl = url;
    }
    public getCategory(): string {
        return this.category;
    }
    public setCategory(cat:string): void {
        this.category = cat;
    }
    public getOwner(): string {
        return this.placeUrl.split("/")[2];
    }
    public isOwner(webID:string): boolean {
        return this.getOwner() === webID.split("/")[2];
    }
}