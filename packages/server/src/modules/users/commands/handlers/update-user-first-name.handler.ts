import {CommandHandler} from "@nestjs/cqrs";
import {UpdateUserFirstNameCommand} from "../impl/update-user-first-name.command";
import {Connection} from "typeorm/index";
import {BaseCommandHandler} from "../../../core/base/commands/handlers/base.command-handler";
import {User} from "../../user.entity";
import {UserFactory} from "../../user.factory";
import {UserAggregateRoot} from "../../domain/user.aggregate";

@CommandHandler(UpdateUserFirstNameCommand)
export class UpdateUserFirstNameCommandHandler extends BaseCommandHandler<UpdateUserFirstNameCommand, User, UserAggregateRoot, UserFactory> {

    constructor(
        userFactory: UserFactory,
        connection: Connection
    ) {
        super(User, userFactory, connection);
    }

    protected async executeInternal(command: UpdateUserFirstNameCommand) {
        const { aggregateRootId, firstName } = command;

        const user = await this.getAggregateRootFromEntity(aggregateRootId);

        user.updateFirstName(firstName);
        user.commit();
    }
}