import {CommandHandler} from "@nestjs/cqrs";
import {DeactivateUserCommand} from "../impl/deactivate-user.command";
import {Connection} from "typeorm/index";
import {BaseCommandHandler} from "../../../core/base/commands/handlers/base.command-handler";
import {User} from "../../user.entity";
import {UserFactory} from "../../user.factory";
import {UserAggregateRoot} from "../../domain/user.aggregate";
import {DomainValidationException} from "../../../core/exceptions/impl/domain-validation.exception";

@CommandHandler(DeactivateUserCommand)
export class DeactivateUserCommandHandler extends BaseCommandHandler<DeactivateUserCommand, User, UserAggregateRoot, UserFactory> {

    constructor(
        userFactory: UserFactory,
        connection: Connection
    ) {
        super(User, userFactory, connection);
    }

    protected async executeInternal(command: DeactivateUserCommand) {
        const { aggregateRootId } = command;

        const userEntity = await this.getEntity(aggregateRootId);

        if (!userEntity.isActive) {
            throw new DomainValidationException('User is already inactive', UserAggregateRoot);
        }

        const user = await this.getAggregateRootFromEntity(aggregateRootId, userEntity);

        user.deactivate();
        user.commit();
    }
}