import {CommandHandler} from "@nestjs/cqrs";
import {UpdateUserLastNameCommand} from "../impl/update-user-last-name.command";
import {Connection} from "typeorm/index";
import {BaseCommandHandler} from "../../../core/base/commands/handlers/base.command-handler";
import {User} from "../../user.entity";
import {UserFactory} from "../../user.factory";
import {UserAggregateRoot} from "../../domain/user.aggregate";

@CommandHandler(UpdateUserLastNameCommand)
export class UpdateUserLastNameCommandHandler extends BaseCommandHandler<UpdateUserLastNameCommand, User, UserAggregateRoot, UserFactory> {

    constructor(
        userFactory: UserFactory,
        connection: Connection
    ) {
        super(User, userFactory, connection);
    }

    protected async executeInternal(command: UpdateUserLastNameCommand) {
        const { aggregateRootId, lastName } = command;

        const user = await this.getAggregateRootFromEntity(aggregateRootId);

        user.updateLastName(lastName);
        user.commit();
    }
}