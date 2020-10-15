import {BaseDomainEvent} from "../../../core/base/events/impl/base-domain.event";
import {IAddUserPermissions} from "../../commands/impl/add-user-permissions.command";
import {Permission} from "../../models/Permission";

export class UserPermissionsAddedEvent extends BaseDomainEvent<IAddUserPermissions> {
    constructor(
        aggregateRootId: string,
        public readonly permissionsToAdd: Permission[]
    ) {
        super(aggregateRootId);
    }
}