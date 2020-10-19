import {User} from "../../src/modules/users/user.entity";
import {v4} from "uuid";
import {Permission} from "../../src/modules/users/models/Permission";

export class UserMock_JohnDoe extends User {
    firstName: string = "John";
    lastName: string = "Doe";
    email: string = "john.doe@monorepo.xyz.com";
    isActive: boolean = true;
    password: string = "1234";
    permissions: Permission[] = [Permission.Default];

    constructor(id: string = v4()) {
        super();

        this.id = id;
    }
}