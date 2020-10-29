import {BaseEventHandler} from "../../../domain/events/handlers/base.event-handler";
import {UserLastNameUpdatedEvent} from "../impl/user-last-name-updated.event";
import {Connection} from "typeorm/index";
import {EventsHandler} from "@nestjs/cqrs";
import {UserRepository} from "../../user.repository";

@EventsHandler(UserLastNameUpdatedEvent)
export class UserLastNameUpdatedEventHandler extends BaseEventHandler<UserLastNameUpdatedEvent, UserRepository> {
    constructor(
        connection: Connection
    ) {
        super(UserRepository, connection);
    }

    async handleInternal(event: UserLastNameUpdatedEvent) {
        const { aggregateRootId, params: { lastName } } = event;

        const user = await this.entityRepository.findOne(aggregateRootId);
        user.lastName = lastName;

        await this.entityRepository.save(user);
    }
}