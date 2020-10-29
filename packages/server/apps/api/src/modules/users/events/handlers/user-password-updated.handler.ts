import {BaseEventHandler} from "../../../domain/events/handlers/base.event-handler";
import {UserPasswordUpdatedEvent} from "../impl/user-password-updated.event";
import {Connection} from "typeorm/index";
import {EventsHandler} from "@nestjs/cqrs";
import {UserRepository} from "../../user.repository";

@EventsHandler(UserPasswordUpdatedEvent)
export class UserPasswordUpdatedEventHandler extends BaseEventHandler<UserPasswordUpdatedEvent, UserRepository> {
    constructor(
        connection: Connection
    ) {
        super(UserRepository, connection);
    }

    async handleInternal(event: UserPasswordUpdatedEvent) {
        const { aggregateRootId, params: { newPassword } } = event;

        const user = await this.entityRepository.findOne(aggregateRootId);
        user.password = newPassword;

        await this.entityRepository.save(user);
    }
}