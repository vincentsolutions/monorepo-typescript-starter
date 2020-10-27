import {BaseDomainCommand} from "../../../domain/commands/impl/base-domain.command";
import {Permission} from "@sharedKernel";

export interface IAddUserPermissions {
    permissionsToAdd: Permission[];
}

export class AddUserPermissionsCommand extends BaseDomainCommand<IAddUserPermissions> implements IAddUserPermissions {
    constructor(
        public readonly aggregateRootId: string,
        public readonly permissionsToAdd: Permission[]
    ) {
        super(aggregateRootId);
    }
}