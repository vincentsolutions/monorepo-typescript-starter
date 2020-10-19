import {BaseDomainEvent} from "../../../domain/events/impl/base-domain.event";
import {IUpdateUserPassword} from "../../commands/impl/update-user-password.command";

export class UserPasswordUpdatedEvent extends BaseDomainEvent<IUpdateUserPassword> {
    constructor(
        aggregateRootId: string,
        public readonly password: string
    ) {
        super(aggregateRootId);
    }
}