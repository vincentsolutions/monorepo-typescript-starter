import {CommandHandler} from "@nestjs/cqrs";
import {RemoveUserPermissionsCommand} from "../impl/remove-user-permissions.command";
import {Connection} from "typeorm/index";
import {BaseCommandHandler} from "../../../domain/commands/handlers/base.command-handler";
import {User} from "../../user.entity";
import {UserAggregateRoot} from "../../user.aggregate";

@CommandHandler(RemoveUserPermissionsCommand)
export class RemoveUserPermissionsCommandHandler extends BaseCommandHandler<RemoveUserPermissionsCommand, User, UserAggregateRoot> {

    constructor(
        connection: Connection
    ) {
        super(User, UserAggregateRoot, connection);
    }

    protected async executeInternal(command: RemoveUserPermissionsCommand, aggregateRoot: UserAggregateRoot) {
        const { permissionsToRemove } = command;

        aggregateRoot.removePermissions(permissionsToRemove);
        // aggregateRoot.commit();
    }
}