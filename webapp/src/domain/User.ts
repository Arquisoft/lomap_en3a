export default class User {
    private readonly name: string | null;
    private friends: Array<User> | undefined;
    private readonly webID: string;

    constructor(name: string | null, webID: string) {
        this.name = name;
        this.webID = webID;
    }

    public getName(){
        return this.name;
    }
}