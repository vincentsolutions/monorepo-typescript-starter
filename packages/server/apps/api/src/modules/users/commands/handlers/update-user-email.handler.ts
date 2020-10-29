import {CommandHandler} from "@nestjs/cqrs";
import {UpdateUserEmailCommand} from "../impl/update-user-email.command";
import {Connection} from "typeorm/index";
import {BaseCommandHandler} from "../../../domain/commands/handlers/base.command-handler";
import {User} from "../../user.entity";
import {UserAggregateRoot} from "../../user.aggregate";
import {DomainValidationException} from "../../../core/exceptions/impl/domain-validation.exception";

@CommandHandler(UpdateUserEmailCommand)
export class UpdateUserEmailCommandHandler extends BaseCommandHandler<UpdateUserEmailCommand, User, UserAggregateRoot> {

    constructor(
        connection: Connection
    ) {
        super(User, UserAggregateRoot, connection);
    }

    protected executeInternal = async (command: UpdateUserEmailCommand, aggregateRoot: UserAggregateRoot) => {
        const { email } = command;

        await this.checkIfEmailExists(email);

        aggregateRoot.updateEmail(email);
    }

    private async checkIfEmailExists(email: string) {
        const count = await this.entityRepository.count({ email });

        if (count > 0) {
            throw new DomainValidationException("Email is already in use.", UserAggregateRoot)
        }

        return true;
    }
}