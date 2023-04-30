import User from "./User";

export default class Group {
    private name: string;
    private id: string;
    private members: User[];

    public constructor(name: string, members: User[], id: string | null = null) {
        this.name = name;
        this.members = members;
        this.id = (id === null) ? crypto.randomUUID() : id;
    }

    public getMembers(): User[] {
        return this.members;
    }

    public getId(): string {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

}