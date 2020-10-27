import {BaseEventHandler} from "../../../domain/events/handlers/base.event-handler";
import {UserFirstNameUpdatedEvent} from "../impl/user-first-name-updated.event";
import {EventsHandler} from "@nestjs/cqrs";
import {UserRepository} from "../../user.repository";
import {Connection} from "typeorm/index";

@EventsHandler(UserFirstNameUpdatedEvent)
export class UserFirstNameUpdatedEventHandler extends BaseEventHandler<UserFirstNameUpdatedEvent, UserRepository> {
    constructor(
        connection: Connection
    ) {
        super(UserRepository, connection);
    }

    async handleInternal(event: UserFirstNameUpdatedEvent) {
        const { aggregateRootId, params: { firstName } } = event;

        const user = await this.entityRepository.findOne(aggregateRootId);
        user.firstName = firstName;

        await this.entityRepository.save(user);
    }
}