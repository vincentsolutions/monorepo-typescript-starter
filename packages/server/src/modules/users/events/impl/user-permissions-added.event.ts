import {BaseDomainEvent} from "../../../domain/events/impl/base-domain.event";
import {IAddUserPermissions} from "../../commands/impl/add-user-permissions.command";

export class UserPermissionsAddedEvent extends BaseDomainEvent<IAddUserPermissions> {
    constructor(
        aggregateRootId: string,
        params: IAddUserPermissions
    ) {
        super(aggregateRootId, params);
    }
}