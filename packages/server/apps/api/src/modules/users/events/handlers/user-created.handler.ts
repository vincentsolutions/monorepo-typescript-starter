import {BaseDomainEventHandler} from "../../../domain/events/handlers/base-domain.event-handler";
import {UserCreatedEvent} from "../impl/user-created.event";
import {User} from "../../user.entity";
import {Connection} from "typeorm/index";
import {EventsHandler} from "@nestjs/cqrs";
import {UserRepository} from "../../user.repository";

@EventsHandler(UserCreatedEvent)
export class UserCreatedEventHandler extends BaseDomainEventHandler<UserCreatedEvent, UserRepository>{
    constructor(
        connection: Connection
    ) {
        super(UserRepository, connection);
    }

    async handleInternal(event: UserCreatedEvent) {
        const { aggregateRootId, params } = event;

        const newUser = new User();
        newUser.id = aggregateRootId;
        newUser.firstName = params.firstName;
        newUser.lastName = params.lastName;
        newUser.email = params.email;
        newUser.phoneNumber = params.phoneNumber;
        newUser.password = params.password;
        newUser.permissions = params.permissions;

        await this.entityRepository.save(newUser);
    }
}