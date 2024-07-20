export class UserModelDto {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    createdAt: Date;

    constructor(id: number, firstname: string, lastname: string, email: string, createdAt: Date) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.createdAt = createdAt;
    }
}