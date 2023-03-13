import Placemark from "./Placemark";

export default class Map {
    private placemarks: Array<Placemark> = new Array<Placemark>();

    public add(p: Placemark): void {
        this.placemarks.push(p);
    }

    public remove(p: Placemark): void {
        let index: number = this.placemarks.indexOf(p);

        if (index > -1) { 
            this.placemarks.splice(index, 1);
        }  
    }

    public getPlacemarks(): Array<Placemark> {
        return [...this.placemarks];
    }

}