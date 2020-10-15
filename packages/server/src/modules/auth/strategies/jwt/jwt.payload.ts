import {Permission} from "../../../users/models/Permission";

export class BaseJwtOptions {
    readonly sub: string;
    readonly email: string;
}

export class JwtPayload extends BaseJwtOptions {
    readonly firstName: string;
    readonly lastName: string;
    readonly permissions: Permission[];
    readonly isActive: boolean;
}