import {CommandHandler} from "@nestjs/cqrs";
import {UpdateUserLastNameCommand} from "../impl/update-user-last-name.command";
import {Connection} from "typeorm/index";
import {BaseCommandHandler} from "../../../domain/commands/handlers/base.command-handler";
import {User} from "../../user.entity";
import {UserAggregateRoot} from "../../user.aggregate";

@CommandHandler(UpdateUserLastNameCommand)
export class UpdateUserLastNameCommandHandler extends BaseCommandHandler<UpdateUserLastNameCommand, User, UserAggregateRoot> {

    constructor(
        connection: Connection
    ) {
        super(User, UserAggregateRoot, connection);
    }

    protected async executeInternal(command: UpdateUserLastNameCommand, aggregateRoot: UserAggregateRoot) {
        const { lastName } = command;

        aggregateRoot.updateLastName(lastName);
        // aggregateRoot.commit();
    }
}