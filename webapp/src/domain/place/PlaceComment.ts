export default class PlaceComment {

  // private fields
  private _user: string;
  private _comment: string;
  private _id: string;

  // constructor
  constructor(user: string, comment: string, id:string="") {
    this._user = user;
    this._comment = comment;
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

  get id(): string {
    return this._id;
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