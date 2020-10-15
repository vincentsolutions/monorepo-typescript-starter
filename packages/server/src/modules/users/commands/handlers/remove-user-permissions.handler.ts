import {CommandHandler} from "@nestjs/cqrs";
import {RemoveUserPermissionsCommand} from "../impl/remove-user-permissions.command";
import {Connection} from "typeorm/index";
import {BaseCommandHandler} from "../../../core/base/commands/handlers/base.command-handler";
import {User} from "../../user.entity";
import {UserFactory} from "../../user.factory";
import {UserAggregateRoot} from "../../domain/user.aggregate";

@CommandHandler(RemoveUserPermissionsCommand)
export class RemoveUserPermissionsCommandHandler extends BaseCommandHandler<RemoveUserPermissionsCommand, User, UserAggregateRoot, UserFactory> {

    constructor(
        userFactory: UserFactory,
        connection: Connection
    ) {
        super(User, userFactory, connection);
    }

    protected async executeInternal(command: RemoveUserPermissionsCommand) {
        const { aggregateRootId, permissionsToRemove } = command;

        const entity = await this.getEntity(aggregateRootId);

        if (permissionsToRemove.every(x => !entity.permissions.includes(x))) {
            return;
        }

        const user = await this.getAggregateRootFromEntity(aggregateRootId, entity);

        user.removePermissions(permissionsToRemove);
        user.commit();
    }
}