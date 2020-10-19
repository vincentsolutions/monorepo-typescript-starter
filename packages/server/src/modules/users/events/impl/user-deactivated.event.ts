import {BaseDomainEvent} from "../../../domain/events/impl/base-domain.event";
import {IDeactivateUser} from "../../commands/impl/deactivate-user.command";

export class UserDeactivatedEvent extends BaseDomainEvent<IDeactivateUser> {
    constructor(
        aggregateRootId: string
    ) {
        super(aggregateRootId);
    }
}