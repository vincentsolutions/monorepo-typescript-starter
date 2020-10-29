import {BaseEventHandler} from "../../../domain/events/handlers/base.event-handler";
import {UserPermissionsRemovedEvent} from "../impl/user-permissions-removed.event";
import {Connection} from "typeorm/index";
import {EventsHandler} from "@nestjs/cqrs";
import {UserRepository} from "../../user.repository";

@EventsHandler(UserPermissionsRemovedEvent)
export class UserPermissionsRemovedEventHandler extends BaseEventHandler<UserPermissionsRemovedEvent, UserRepository> {
    constructor(
        connection: Connection
    ) {
        super(UserRepository, connection);
    }

    async handleInternal(event: UserPermissionsRemovedEvent) {
        const { aggregateRootId, params: { permissionsToRemove } } = event;

        const user = await this.entityRepository.findOne(aggregateRootId);

        user.permissions = user.permissions.filter(x => !permissionsToRemove.includes(x));

        await this.entityRepository.save(user);
    }
}