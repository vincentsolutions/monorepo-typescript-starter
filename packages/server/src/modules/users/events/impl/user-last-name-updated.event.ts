import {BaseDomainEvent} from "../../../domain/events/impl/base-domain.event";
import {IUpdateUserLastName} from "../../commands/impl/update-user-last-name.command";

export class UserLastNameUpdatedEvent extends BaseDomainEvent<IUpdateUserLastName> {
    constructor(
        aggregateRootId: string,
        public readonly lastName: string
    ) {
        super(aggregateRootId);
    }
}