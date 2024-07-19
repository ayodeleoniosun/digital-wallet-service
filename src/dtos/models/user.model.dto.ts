export class UserModelDto {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    createdAt: Date;

    constructor(id: string, firstname: string, lastname: string, email: string, createdAt: Date) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.createdAt = createdAt;
    }
}