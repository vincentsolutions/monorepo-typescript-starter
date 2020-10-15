import {BaseDomainEvent} from "../../../core/base/events/impl/base-domain.event";
import {IReactivateUser} from "../../commands/impl/reactivate-user.command";

export class UserReactivatedEvent extends BaseDomainEvent<IReactivateUser> {
    constructor(
        aggregateRootId: string
    ) {
        super(aggregateRootId);
    }
}