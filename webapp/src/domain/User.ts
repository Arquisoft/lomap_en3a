export default class User {
    private readonly webID: string;
    private readonly name: string | null;
    private _photo: string | null = null;
    private _note: string | null = null;
    private _role: string | null = null;
    private _organization: string | null = null;

    constructor(name: string | null, webID: string) {
        this.name = name;
        this.webID = webID;
    }

    public getName() {
        return this.name;
    }

    public getWebId() {
        return this.webID;
    }

    set photo(photo: string | null){
        this._photo = photo;
    }

    get photo(){
        return this._photo;
    }

    set note(note: string | null){
        this._note = note;
    }

    get note(){
        return this._note;
    }

    set role(role: string | null){
        this._role = role;
    }

    get role(){
        return this._role;
    }

    set organization(organization: string | null){
        this._organization = organization;
    }

    get organization(){
        return this._organization;
    }
}