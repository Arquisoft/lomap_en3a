import Place from "../Place";

export default class PlaceRating {

  // private fields
  private _place: Place;
  private _user: string;
  private _rate: number;

  // constructor
  constructor(place: Place, user: string, rate: number) {
    this._place = place;
    this._user = user;
    this._rate = rate;
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

  // getter for rating
  get rate(): number {
    return this._rate;
  }

  // setter for comment
  set comment(rate: number) {
    this._rate = rate;
  }
}