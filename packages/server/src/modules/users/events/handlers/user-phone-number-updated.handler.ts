import {BaseEventHandler} from "../../../domain/events/handlers/base.event-handler";
import {UserPhoneNumberUpdatedEvent} from "../impl/user-phone-number-updated.event";
import {Connection} from "typeorm/index";
import {EventsHandler} from "@nestjs/cqrs";
import {UserRepository} from "../../user.repository";

@EventsHandler(UserPhoneNumberUpdatedEvent)
export class UserPhoneNumberUpdatedEventHandler extends BaseEventHandler<UserPhoneNumberUpdatedEvent, UserRepository> {
    constructor(
        connection: Connection
    ) {
        super(UserRepository, connection);
    }

    async handleInternal(event: UserPhoneNumberUpdatedEvent) {
        const { aggregateRootId, params: { phoneNumber } } = event;

        const user = await this.entityRepository.findOne(aggregateRootId);
        user.phoneNumber = phoneNumber;

        await this.entityRepository.save(user);
    }
}