import {BaseDomainCommand} from "../../../domain/commands/impl/base-domain.command";
import {Permission} from "@sharedKernel";

export interface IRemoveUserPermissions {
    permissionsToRemove: Permission[];
}

export class RemoveUserPermissionsCommand extends BaseDomainCommand<IRemoveUserPermissions> implements IRemoveUserPermissions {
    constructor(
        public readonly aggregateRootId: string,
        public readonly permissionsToRemove: Permission[]
    ) {
        super(aggregateRootId);
    }
}