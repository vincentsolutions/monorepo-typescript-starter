import {CommandHandler} from "@nestjs/cqrs";
import {UpdateUserFirstNameCommand} from "../impl/update-user-first-name.command";
import {Connection} from "typeorm/index";
import {BaseCommandHandler} from "../../../domain/commands/handlers/base.command-handler";
import {User} from "../../user.entity";
import {UserAggregateRoot} from "../../user.aggregate";

@CommandHandler(UpdateUserFirstNameCommand)
export class UpdateUserFirstNameCommandHandler extends BaseCommandHandler<UpdateUserFirstNameCommand, User, UserAggregateRoot> {

    constructor(
        connection: Connection
    ) {
        super(User, UserAggregateRoot, connection);
    }

    protected async executeInternal(command: UpdateUserFirstNameCommand, aggregateRoot: UserAggregateRoot) {
        const { firstName } = command;

        aggregateRoot.updateFirstName(firstName);
    }
}