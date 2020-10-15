import {BaseDomainEvent} from "../../../core/base/events/impl/base-domain.event";
import {IUpdateUserFirstName} from "../../commands/impl/update-user-first-name.command";

export class UserFirstNameUpdatedEvent extends BaseDomainEvent<IUpdateUserFirstName> {
    constructor(
        aggregateRootId: string,
        public readonly firstName: string
    ) {
        super(aggregateRootId);
    }
}