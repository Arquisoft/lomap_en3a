export default class PlaceRating {

  // private fields
  private _user: string;
  private _score: number;
  private _id: string;

  // constructor
  constructor(user: string, score: number, id:string="") {
    this._user = user;
    this._score = score;
    this._id = id==="" ? crypto.randomUUID() : id;
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
  get score(): number {
    return this._score;
  }

  // setter for rating
  set score(score: number) {
    this._score = score;
  }

  get id(): string {
    return this._id;
  }
  
}