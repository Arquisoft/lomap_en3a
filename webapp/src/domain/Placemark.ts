export default class Placemark {
    private lng: number;
    private lat: number;
    private title: string;
    private placeUrl: string;
    private category: string;

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
}