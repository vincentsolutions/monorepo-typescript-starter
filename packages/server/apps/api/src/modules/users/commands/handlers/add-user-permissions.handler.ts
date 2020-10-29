import {CommandHandler} from "@nestjs/cqrs";
import {AddUserPermissionsCommand} from "../impl/add-user-permissions.command";
import {Connection} from "typeorm/index";
import {BaseCommandHandler} from "../../../domain/commands/handlers/base.command-handler";
import {User} from "../../user.entity";
import {UserAggregateRoot} from "../../user.aggregate";

@CommandHandler(AddUserPermissionsCommand)
export class AddUserPermissionsCommandHandler extends BaseCommandHandler<AddUserPermissionsCommand, User, UserAggregateRoot> {

    constructor(
        connection: Connection
    ) {
        super(User, UserAggregateRoot, connection);
    }

    protected async executeInternal(command: AddUserPermissionsCommand, aggregateRoot: UserAggregateRoot) {
        const { permissionsToAdd } = command;

        aggregateRoot.addPermissions(permissionsToAdd);
        // aggregateRoot.commit();
    }
}