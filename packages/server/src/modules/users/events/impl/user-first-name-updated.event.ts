import {BaseDomainEvent} from "../../../domain/events/impl/base-domain.event";
import {IUpdateUserFirstName} from "../../commands/impl/update-user-first-name.command";

export class UserFirstNameUpdatedEvent extends BaseDomainEvent<IUpdateUserFirstName> {
    constructor(
        aggregateRootId: string,
        params: IUpdateUserFirstName
    ) {
        super(aggregateRootId, params);
    }
}