export default class Placemark {
    private lng: number;
    private lat: number;
    private title: string;

    public constructor(lat:number, lng:number, title:string="") {
        this.lat = lat;
        this.lng = lng;
        this.title = title;
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
}