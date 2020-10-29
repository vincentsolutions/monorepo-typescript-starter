import {Permission} from "../../internal";

export interface IUpdateUserFirstName {
    firstName: string;
}

export interface IUpdateUserPhoneNumber {
    phoneNumber?: string;
}

export interface IAddUserPermissions {
    permissionsToAdd: Permission[];
}

export interface ICreateUser {
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly password: string;
    readonly phoneNumber?: string;
    readonly permissions?: Permission[];
}

export interface IDeactivateUser {

}

export interface IReactivateUser {

}

export interface IRemoveUserPermissions {
    permissionsToRemove: Permission[];
}

export interface IUpdateUserEmail {
    email: string;
}

export interface IUpdateUserLastName {
    lastName: string;
}

export interface IUpdateUserPassword {
    currentPassword: string;
    newPassword: string;
}

