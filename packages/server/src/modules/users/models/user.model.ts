import {User} from "../user.entity";
import {BaseModel} from "../../core/base/models/base.model";
import {Permission} from "./Permission";

export class UserModel extends BaseModel {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    isActive: boolean;
    readonly permissions: Permission[];

    public static fromEntity(entity: User) {
        const model = new this();

        model.id = entity.id;
        model.firstName = entity.firstName;
        model.lastName = entity.lastName;
        model.email = entity.email;
        model.phoneNumber = entity.phoneNumber;
        model.isActive = entity.isActive;

        return model;
    }
}