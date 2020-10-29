import {BaseEventHandler} from "../../../domain/events/handlers/base.event-handler";
import {UserDeactivatedEvent} from "../impl/user-deactivated.event";
import {Connection} from "typeorm/index";
import {EventsHandler} from "@nestjs/cqrs";
import {UserRepository} from "../../user.repository";

@EventsHandler(UserDeactivatedEvent)
export class UserDeactivatedEventHandler extends BaseEventHandler<UserDeactivatedEvent, UserRepository> {
    constructor(
        connection: Connection
    ) {
        super(UserRepository, connection);
    }

    async handleInternal(event: UserDeactivatedEvent) {
        const { aggregateRootId } = event;

        const user = await this.entityRepository.findOne(aggregateRootId);

        user.isActive = false;
        await this.entityRepository.save(user);
    }
}