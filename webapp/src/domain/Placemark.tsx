export default class Placemark {
    private lng: number;
    private lat: number;
    private title: string;
    private placeUrl: string;

    public constructor(lat:number, lng:number, title:string="", placeUrl:string="") {
        this.lat = lat;
        this.lng = lng;
        this.title = title;
        this.placeUrl = placeUrl;
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
}