import {BaseDomainCommand} from "../../../domain/commands/impl/base-domain.command";
import {Permission, IAddUserPermissions} from "@sharedKernel";

export class AddUserPermissionsCommand extends BaseDomainCommand<IAddUserPermissions> implements IAddUserPermissions {
    constructor(
        public readonly aggregateRootId: string,
        public readonly permissionsToAdd: Permission[]
    ) {
        super(aggregateRootId);
    }
}