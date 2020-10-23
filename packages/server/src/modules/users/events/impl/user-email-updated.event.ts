import {BaseDomainEvent} from "../../../domain/events/impl/base-domain.event";
import {IUpdateUserEmail} from "../../commands/impl/update-user-email.command";

export class UserEmailUpdatedEvent extends BaseDomainEvent<IUpdateUserEmail> {
    constructor(
        aggregateRootId: string,
        params: IUpdateUserEmail
    ) {
        super(aggregateRootId, params);
    }
}