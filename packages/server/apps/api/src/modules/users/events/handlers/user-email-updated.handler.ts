import {BaseEventHandler} from "../../../domain/events/handlers/base.event-handler";
import {UserEmailUpdatedEvent} from "../impl/user-email-updated.event";
import {Connection} from "typeorm/index";
import {EventsHandler} from "@nestjs/cqrs";
import {UserRepository} from "../../user.repository";

@EventsHandler(UserEmailUpdatedEvent)
export class UserEmailUpdatedEventHandler extends BaseEventHandler<UserEmailUpdatedEvent, UserRepository> {
    constructor(
        connection: Connection
    ) {
        super(UserRepository, connection);
    }

    async handleInternal(event: UserEmailUpdatedEvent) {
        const { aggregateRootId, params: { email } } = event;

        const user = await this.entityRepository.findOne(aggregateRootId);
        user.email = email;

        await this.entityRepository.save(user);
    }
}