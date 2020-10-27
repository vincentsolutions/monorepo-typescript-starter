import {Permission} from "../internal";

export interface IBaseJwtPayload {
    readonly sub: string;
    readonly email: string;
}

export interface IJwtPayload extends IBaseJwtPayload {
    readonly firstName: string;
    readonly lastName: string;
    readonly permissions: Permission[];
    readonly isActive: boolean;
}