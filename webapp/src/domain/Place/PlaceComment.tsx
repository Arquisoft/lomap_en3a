import Place from "../Place";

export default class PlaceComment {

  // private fields
  private _place: Place;
  private _user: string;
  private _comment: string;

  // constructor
  constructor(place: Place, user: string, comment: string) {
    this._place = place;
    this._user = user;
    this._comment = comment;
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

  // getter for comment
  get comment(): string {
    return this._comment;
  }

  // setter for comment
  set comment(comment: string) {
    this._comment = comment;
  }
}