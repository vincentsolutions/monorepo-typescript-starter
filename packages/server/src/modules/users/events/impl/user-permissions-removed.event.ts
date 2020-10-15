import {BaseDomainEvent} from "../../../core/base/events/impl/base-domain.event";
import {IRemoveUserPermissions} from "../../commands/impl/remove-user-permissions.command";
import {Permission} from "../../models/Permission";

export class UserPermissionsRemovedEvent extends BaseDomainEvent<IRemoveUserPermissions> {
    constructor(
        aggregateRootId: string,
        public readonly permissionsToRemove: Permission[]
    ) {
        super(aggregateRootId);
    }
}