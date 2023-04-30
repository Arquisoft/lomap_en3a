export default class User {
    private readonly webID: string | null;
    private readonly name: string | null;
    private readonly photo: string | null;
    private readonly note: string | null;
    private readonly role: string | null;
    private readonly organization: string | null;

    constructor(name: string | null, webID: string | null, photo: string | null,
                note: string | null, role: string | null, organization: string | null) {
        this.name = name;
        this.webID = webID;
        this.photo = photo;
        this.note = note;
        this.role = role;
        this.organization = organization;
    }

    public getName() {
        return this.name;
    }

    public getWebId() {
        return this.webID;
    }
}