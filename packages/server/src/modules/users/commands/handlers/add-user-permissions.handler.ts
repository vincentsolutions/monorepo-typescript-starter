import {CommandHandler} from "@nestjs/cqrs";
import {AddUserPermissionsCommand} from "../impl/add-user-permissions.command";
import {Connection} from "typeorm/index";
import {BaseCommandHandler} from "../../../core/base/commands/handlers/base.command-handler";
import {User} from "../../user.entity";
import {UserFactory} from "../../user.factory";
import {UserAggregateRoot} from "../../domain/user.aggregate";

@CommandHandler(AddUserPermissionsCommand)
export class AddUserPermissionsCommandHandler extends BaseCommandHandler<AddUserPermissionsCommand, User, UserAggregateRoot, UserFactory> {

    constructor(
        userFactory: UserFactory,
        connection: Connection
    ) {
        super(User, userFactory, connection);
    }

    protected async executeInternal(command: AddUserPermissionsCommand) {
        const { aggregateRootId, permissionsToAdd } = command;

        const entity = await this.getEntity(aggregateRootId);

        if (permissionsToAdd.every(x => entity.permissions.includes(x))) {
            return;
        }

        const user = await this.getAggregateRootFromEntity(aggregateRootId, entity);

        user.addPermissions(permissionsToAdd);
        user.commit();
    }
}