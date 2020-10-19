import {BaseDomainEvent} from "../../../domain/events/impl/base-domain.event";
import {ICreateUser} from "../../commands/impl/create-user.command";

export class UserCreatedEvent extends BaseDomainEvent<ICreateUser> {
    constructor(
        aggregateRootId: string,
        params: ICreateUser
    ) {
        super(aggregateRootId, params);
    }
}