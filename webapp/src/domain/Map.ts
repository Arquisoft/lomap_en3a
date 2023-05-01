import Placemark from "./Placemark";

export default class Map {
    private placemarks: Array<Placemark> = new Array<Placemark>();
    private id: string;
    private name: string;
    private description: string;

    public constructor(name: string, description: string = "", id: string | null = null) {
        this.name = name;
        this.description = description;
        this.id = (id === null) ? crypto.randomUUID() : id;
    }

    public add(p: Placemark): void {
        this.placemarks.push(p);
    }

    public setPlacemarks(p: Placemark[]): void {
        this.placemarks = p;
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

    public getId(): string {
        return this.id;
    }

    public getDescription(): string {
        return this.description;
    }

    public getName(): string {
        return this.name;
    }
}