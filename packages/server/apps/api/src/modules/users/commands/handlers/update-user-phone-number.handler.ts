import {CommandHandler} from "@nestjs/cqrs";
import {UpdateUserPhoneNumberCommand} from "../impl/update-user-phone-number.command";
import {Connection} from "typeorm/index";
import {BaseCommandHandler} from "../../../domain/commands/handlers/base.command-handler";
import {User} from "../../user.entity";
import {UserAggregateRoot} from "../../user.aggregate";

@CommandHandler(UpdateUserPhoneNumberCommand)
export class UpdateUserPhoneNumberCommandHandler extends BaseCommandHandler<UpdateUserPhoneNumberCommand, User, UserAggregateRoot> {

    constructor(
        connection: Connection
    ) {
        super(User, UserAggregateRoot, connection);
    }

    protected async executeInternal(command: UpdateUserPhoneNumberCommand, aggregateRoot: UserAggregateRoot) {
        const { phoneNumber } = command;

        aggregateRoot.updatePhoneNumber(phoneNumber);
    }
}