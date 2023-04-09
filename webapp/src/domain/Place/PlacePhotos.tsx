import Place from "../Place";

export default class PlacePhotos {

  // private fields
  private _place: Place;
  private _user: string;
  private _photos: File[];

  // constructor
  constructor(place: Place, user: string, photos: File[]) {
    this._place = place;
    this._user = user;
    this._photos = photos;
  }

  // getter for place
  get place(): Place {
    return this._place;
  }

  // setter for place
  set place(place: Place) {
    this._place = place;
  }

  // getter for user
  get user(): string {
    return this._user;
  }

  // setter for user
  set user(user: string) {
    this._user = user;
  }

  // getter for photos
  get rate(): File[] {
    return this._photos;
  }

  // setter for photos
  set comment(photos: File[]) {
    this._photos = photos;
  }
}