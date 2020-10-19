import {CommandHandler} from "@nestjs/cqrs";
import {ReactivateUserCommand} from "../impl/reactivate-user.command";
import {Connection} from "typeorm/index";
import {BaseCommandHandler} from "../../../domain/commands/handlers/base.command-handler";
import {User} from "../../user.entity";
import {UserAggregateRoot} from "../../user.aggregate";

@CommandHandler(ReactivateUserCommand)
export class ReactivateUserCommandHandler extends BaseCommandHandler<ReactivateUserCommand, User, UserAggregateRoot> {

    constructor(
        connection: Connection
    ) {
        super(User, UserAggregateRoot, connection);
    }

    protected async executeInternal(command: ReactivateUserCommand, aggregateRoot: UserAggregateRoot) {

        aggregateRoot.reactivate();
        // aggregateRoot.commit();
    }
}