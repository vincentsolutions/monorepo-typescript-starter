import {CommandHandler} from "@nestjs/cqrs";
import {ReactivateUserCommand} from "../impl/reactivate-user.command";
import {Connection} from "typeorm/index";
import {BaseCommandHandler} from "../../../core/base/commands/handlers/base.command-handler";
import {User} from "../../user.entity";
import {UserFactory} from "../../user.factory";
import {UserAggregateRoot} from "../../domain/user.aggregate";
import {DomainValidationException} from "../../../core/exceptions/impl/domain-validation.exception";

@CommandHandler(ReactivateUserCommand)
export class ReactivateUserCommandHandler extends BaseCommandHandler<ReactivateUserCommand, User, UserAggregateRoot, UserFactory> {

    constructor(
        userFactory: UserFactory,
        connection: Connection
    ) {
        super(User, userFactory, connection);
    }

    protected async executeInternal(command: ReactivateUserCommand) {
        const { aggregateRootId } = command;

        const userEntity = await this.getEntity(aggregateRootId);

        if (userEntity.isActive) {
            throw new DomainValidationException('User is already active', UserAggregateRoot);
        }

        const user = await this.getAggregateRootFromEntity(aggregateRootId, userEntity);

        if (user)

        user.reactivate();
        user.commit();
    }
}