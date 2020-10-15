import {CommandHandler} from "@nestjs/cqrs";
import {UpdateUserEmailCommand} from "../impl/update-user-email.command";
import {Connection} from "typeorm/index";
import {BaseCommandHandler} from "../../../core/base/commands/handlers/base.command-handler";
import {User} from "../../user.entity";
import {UserFactory} from "../../user.factory";
import {UserAggregateRoot} from "../../domain/user.aggregate";
import {DomainValidationException} from "../../../core/exceptions/impl/domain-validation.exception";

@CommandHandler(UpdateUserEmailCommand)
export class UpdateUserEmailCommandHandler extends BaseCommandHandler<UpdateUserEmailCommand, User, UserAggregateRoot, UserFactory> {

    constructor(
        userFactory: UserFactory,
        connection: Connection
    ) {
        super(User, userFactory, connection);
    }

    protected async executeInternal(command: UpdateUserEmailCommand) {
        const { aggregateRootId, email } = command;

        await this.checkIfEmailExists(email);

        const user = await this.getAggregateRootFromEntity(aggregateRootId);

        user.updateEmail(email);
        user.commit();
    }

    private async checkIfEmailExists(email: string) {
        const count = await this.entityRepository.count({ email });

        if (count > 0) {
            throw new DomainValidationException("Email is already in use.", UserAggregateRoot)
        }

        return true;
    }
}