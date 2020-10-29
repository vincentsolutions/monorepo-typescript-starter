import {BaseEventHandler} from "../../../domain/events/handlers/base.event-handler";
import {UserPermissionsAddedEvent} from "../impl/user-permissions-added.event";
import {Connection} from "typeorm/index";
import {EventsHandler} from "@nestjs/cqrs";
import {UserRepository} from "../../user.repository";

@EventsHandler(UserPermissionsAddedEvent)
export class UserPermissionsAddedEventHandler extends BaseEventHandler<UserPermissionsAddedEvent, UserRepository> {
    constructor(
        connection: Connection
    ) {
        super(UserRepository, connection);
    }

    async handleInternal(event: UserPermissionsAddedEvent) {
        const { aggregateRootId, params: { permissionsToAdd } } = event;

        const user = await this.entityRepository.findOne(aggregateRootId);

        for (const permission of permissionsToAdd) {
            if (user.permissions.includes(permission)) {
                continue;
            }

            user.permissions.push(permission)
        }

        await this.entityRepository.save(user);
    }
}