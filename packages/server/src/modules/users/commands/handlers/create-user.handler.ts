import {CreateUserCommand} from "../impl/create-user.command";
import {BaseCommandHandler} from "../../../core/base/commands/handlers/base.command-handler";
import {CommandHandler} from "@nestjs/cqrs";
import {UserAggregateRoot} from "../../domain/user.aggregate";
import {DomainValidationException} from "../../../core/exceptions/impl/domain-validation.exception";
import {User} from "../../user.entity";
import {Connection} from "typeorm/index";
import {UserFactory} from "../../user.factory";

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler extends BaseCommandHandler<CreateUserCommand, User, UserAggregateRoot, UserFactory> {
    constructor(
        connection: Connection,
        userFactory: UserFactory
    ) {
        super(User, userFactory, connection);
    }

    async executeInternal(command: CreateUserCommand): Promise<any> {
        const { aggregateRootId, email, password } = command;

        await this.validateDuplicateEmail(email);
        this.validatePassword(password);

        const user = await this.initAggregateRootFromCreateCommand(aggregateRootId, command);
        user.commit();
    }

    async validateDuplicateEmail(email: string) {
        const count = await this.entityRepository.count({
            email
        });

        if (count > 0) {
            throw new DomainValidationException('Email is already in use.', UserAggregateRoot);
        }
    }

    validatePassword(password: string) {
        if (password.length < 8) {
            throw new DomainValidationException('Password must be 8 characters or longer.', UserAggregateRoot);
        }

        if (!/(?=.*[a-z])/.test(password)) {
            throw new DomainValidationException('Password must include 1 lowercase character.', UserAggregateRoot);
        }

        if (!/(?=.*[A-Z])/.test(password)) {
            throw new DomainValidationException('Password must include 1 uppercase character.', UserAggregateRoot);
        }

        if (!/(?=.*\d)/.test(password)) {
            throw new DomainValidationException('Password must include a number.', UserAggregateRoot);
        }
    }
}