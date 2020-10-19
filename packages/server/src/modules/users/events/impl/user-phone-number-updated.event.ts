import {BaseDomainEvent} from "../../../domain/events/impl/base-domain.event";
import {IUpdateUserPhoneNumber} from "../../commands/impl/update-user-phone-number.command";

export class UserPhoneNumberUpdatedEvent extends BaseDomainEvent<IUpdateUserPhoneNumber> {
    constructor(
        aggregateRootId: string,
        public readonly phoneNumber: string
    ) {
        super(aggregateRootId);
    }
}