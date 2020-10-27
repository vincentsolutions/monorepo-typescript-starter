import {IBaseJwtPayload, IJwtPayload, Permission} from "@sharedKernel";

export class BaseJwtPayload implements IBaseJwtPayload {
    readonly sub: string;
    readonly email: string;
}

export class JwtPayload extends BaseJwtPayload implements IJwtPayload {
    readonly firstName: string;
    readonly lastName: string;
    readonly permissions: Permission[];
    readonly isActive: boolean;
}