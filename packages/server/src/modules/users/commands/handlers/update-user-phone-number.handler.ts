import {CommandHandler} from "@nestjs/cqrs";
import {UpdateUserPhoneNumberCommand} from "../impl/update-user-phone-number.command";
import {Connection} from "typeorm/index";
import {BaseCommandHandler} from "../../../core/base/commands/handlers/base.command-handler";
import {User} from "../../user.entity";
import {UserFactory} from "../../user.factory";
import {UserAggregateRoot} from "../../domain/user.aggregate";

@CommandHandler(UpdateUserPhoneNumberCommand)
export class UpdateUserPhoneNumberCommandHandler extends BaseCommandHandler<UpdateUserPhoneNumberCommand, User, UserAggregateRoot, UserFactory> {

    constructor(
        userFactory: UserFactory,
        connection: Connection
    ) {
        super(User, userFactory, connection);
    }

    protected async executeInternal(command: UpdateUserPhoneNumberCommand) {
        const { aggregateRootId, phoneNumber } = command;

        const user = await this.getAggregateRootFromEntity(aggregateRootId);

        user.updatePhoneNumber(phoneNumber);
        user.commit();
    }
}