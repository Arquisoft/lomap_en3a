export default class User {
    private name: string | undefined;
    private friends: Array<User> | undefined;
    private webID: string;

    constructor(name: string | null, webID: string) {
        this.webID = webID;
        this.getDataFromWebID(webID);
    }

    private getDataFromWebID(id: string):void{

    }
    public getName(){
        return this.name;
    }
}