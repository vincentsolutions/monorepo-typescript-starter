import {CommandHandler} from "@nestjs/cqrs";
import {DeactivateUserCommand} from "../impl/deactivate-user.command";
import {Connection} from "typeorm/index";
import {BaseCommandHandler} from "../../../domain/commands/handlers/base.command-handler";
import {User} from "../../user.entity";
import {UserAggregateRoot} from "../../user.aggregate";

@CommandHandler(DeactivateUserCommand)
export class DeactivateUserCommandHandler extends BaseCommandHandler<DeactivateUserCommand, User, UserAggregateRoot> {

    constructor(
        connection: Connection
    ) {
        super(User, UserAggregateRoot, connection);
    }

    protected async executeInternal(command: DeactivateUserCommand, aggregateRoot: UserAggregateRoot) {
        aggregateRoot.deactivate();
        // aggregateRoot.commit();
    }
}