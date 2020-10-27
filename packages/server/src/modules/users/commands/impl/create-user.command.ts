import {BaseDomainCommand} from "../../../domain/commands/impl/base-domain.command";
import {Permission} from "@sharedKernel";

export interface ICreateUser {
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly password: string;
    readonly phoneNumber?: string;
    readonly permissions?: Permission[];
}

export class CreateUserCommand extends BaseDomainCommand<ICreateUser> implements ICreateUser {
    constructor(
        public readonly aggregateRootId: string,
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly email: string,
        public readonly password: string,
        public readonly phoneNumber?: string,
        public readonly permissions: Permission[] = []
    ) {
        super(aggregateRootId);
    }
}