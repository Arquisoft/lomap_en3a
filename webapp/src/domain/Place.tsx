export default class Place {
    private _title: string;
    private _latitude: number;
    private _longitude: number;
    private _description: string;
    private _photos: File[];
  
    constructor(name: string, latitude: number, longitude: number, description: string, photos: File[]) {
      this._title = name;
      this._latitude = latitude;
      this._longitude = longitude;
      this._description = description;
      this._photos = photos;
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
  
    get photos(): File[]{
      return this._photos;
    }
  
    set photo(photo: File) {
      this._photos = [...this._photos, photo];
    }
    
    set photos(photos: File[]){
      this._photos = photos;
    }
  }