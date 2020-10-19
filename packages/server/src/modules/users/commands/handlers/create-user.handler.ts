import {CreateUserCommand, ICreateUser} from "../impl/create-user.command";
import {BaseCommandHandler} from "../../../domain/commands/handlers/base.command-handler";
import {CommandHandler} from "@nestjs/cqrs";
import {UserAggregateRoot} from "../../user.aggregate";
import {DomainValidationException} from "../../../core/exceptions/impl/domain-validation.exception";
import {User} from "../../user.entity";
import {Connection} from "typeorm/index";
import {CryptoService} from "../../../core/services/crypto.service";

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler extends BaseCommandHandler<CreateUserCommand, User, UserAggregateRoot> {
    constructor(
        connection: Connection,
        private readonly cryptoService: CryptoService
    ) {
        super(User, UserAggregateRoot, connection);
    }

    protected executeInternal(command: CreateUserCommand, aggregateRoot: UserAggregateRoot): Promise<void> {
        return Promise.resolve(undefined);
    }

    async execute(command: CreateUserCommand): Promise<any> {
        const { aggregateRootId, ...params } = command;

        this.logger.log('Starting Command Execution...', this.getContextName());

        await this.validateDuplicateEmail(params.email);
        this.validatePassword(params.password);

        const hashedPassword = await this.cryptoService.hashPassword(params.password);

        const paramsWithHash: ICreateUser = {
            ...params,
            password: hashedPassword
        }

        const user = new UserAggregateRoot(aggregateRootId, paramsWithHash);

        user.markAsCreated(paramsWithHash);
        await this.domainService.save(user);

        this.logger.log('Finished Executing Command.', this.getContextName());
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