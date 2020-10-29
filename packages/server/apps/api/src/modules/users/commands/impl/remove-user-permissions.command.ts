import {BaseDomainCommand} from "../../../domain/commands/impl/base-domain.command";
import {Permission, IRemoveUserPermissions} from "@sharedKernel";

export class RemoveUserPermissionsCommand extends BaseDomainCommand<IRemoveUserPermissions> implements IRemoveUserPermissions {
    constructor(
        public readonly aggregateRootId: string,
        public readonly permissionsToRemove: Permission[]
    ) {
        super(aggregateRootId);
    }
}