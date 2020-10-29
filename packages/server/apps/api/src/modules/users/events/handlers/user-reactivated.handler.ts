import {BaseEventHandler} from "../../../domain/events/handlers/base.event-handler";
import {UserReactivatedEvent} from "../impl/user-reactivated.event";
import {Connection} from "typeorm/index";
import {EventsHandler} from "@nestjs/cqrs";
import {UserRepository} from "../../user.repository";

@EventsHandler(UserReactivatedEvent)
export class UserReactivatedEventHandler extends BaseEventHandler<UserReactivatedEvent, UserRepository> {
    constructor(
        connection: Connection
    ) {
        super(UserRepository, connection);
    }

    async handleInternal(event: UserReactivatedEvent) {
        const { aggregateRootId } = event;

        const user = await this.entityRepository.findOne(aggregateRootId);

        user.isActive = true;
        await this.entityRepository.save(user);
    }
}