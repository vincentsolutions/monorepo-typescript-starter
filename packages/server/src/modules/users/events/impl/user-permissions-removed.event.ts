import {BaseDomainEvent} from "../../../domain/events/impl/base-domain.event";
import {IRemoveUserPermissions} from "../../commands/impl/remove-user-permissions.command";

export class UserPermissionsRemovedEvent extends BaseDomainEvent<IRemoveUserPermissions> {
    constructor(
        aggregateRootId: string,
        params: IRemoveUserPermissions
    ) {
        super(aggregateRootId, params);
    }
}