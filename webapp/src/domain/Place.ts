/**
 * Class to define a point retrieved from the SOLID dataset
 */
export default class Place {
    private _uuid: string = crypto.randomUUID();
    private _title: string;
    private _latitude: number;
    private _longitude: number;
    private _description: string;
    private _photos: File[];
    private _category: string;

    constructor(name: string, latitude: number, longitude: number, description: string, photos: File[] = new Array<File>(), id: string | undefined = undefined, category: string) {
        this._title = name;
        this._latitude = latitude;
        this._longitude = longitude;
        this._description = description;
        this._photos = photos;
        this._uuid = (id === undefined) ? crypto.randomUUID() : id;
        this._category = category;
    }

    get uuid(): string {
        return this._uuid;
    }

    get title(): string {
        return this._title;
    }

    set title(name: string) {
        this._title = name;
    }

    get latitude(): number {
        return this._latitude;
    }

    set latitude(latitude: number) {
        this._latitude = latitude;
    }

    get longitude(): number {
        return this._longitude;
    }

    set longitude(longitude: number) {
        this._longitude = longitude;
    }

    get description(): string {
        return this._description;
    }

    set description(description: string) {
        this._description = description;
    }

    get photos(): File[] {
        return this._photos;
    }

    set photo(photo: File) {
        this._photos = [...this._photos, photo];
    }

    set photos(photos: File[]) {
        this._photos = photos;
    }

    set category(category: string) {
        this._category = category;
    }

    get category(): string {
        return this._category;
    }


    // public imageToBase64(image : File){
    //     var fs = require('fs');
    //     // read binary data
    //     var bitmap = fs.readFileSync(image);
    //     // convert binary data to base64 string
    //     return new Buffer(bitmap).toString('base64');
    // }
}