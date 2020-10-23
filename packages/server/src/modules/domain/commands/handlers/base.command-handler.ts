import {EventPublisher, ICommandHandler} from "@nestjs/cqrs";
import {Inject, LogLevel} from "@nestjs/common";
import {Connection, Repository} from "typeorm/index";
import {EntityClassOrSchema} from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import {BaseDomainEntity} from "../../../core/base/entities/base-domain-entity";
import {AggregateRootConstructor, BaseAggregateRoot} from "../../aggregate/base.aggregate-root";
import {BaseDomainCommand} from "../impl/base-domain.command";
import {DomainService} from "../../services/domain.service";
import {BaseException} from "../../../core/exceptions/impl/base.exception";
import {Logger} from "../../../core/services/logger.service";

export abstract class BaseCommandHandler<
    TCommand extends BaseDomainCommand,
    TEntity extends BaseDomainEntity,
    TAggregate extends BaseAggregateRoot
> implements ICommandHandler<TCommand> {
    @Inject(EventPublisher) protected readonly publisher: EventPublisher;
    @Inject(DomainService) protected readonly domainService: DomainService;
    @Inject(Logger) protected readonly logger: Logger;

    protected readonly entityRepository: Repository<TEntity>;

    protected constructor(
        entityClass: EntityClassOrSchema,
        private readonly aggregateConstructor: AggregateRootConstructor<TAggregate>,
        protected readonly connection: Connection
    ) {
        this.entityRepository = connection.getRepository(entityClass);
    }

    protected abstract executeInternal(command: TCommand, aggregateRoot: TAggregate): Promise<void>;

    public async execute(command: TCommand): Promise<any> {
        this.log('Starting Command Execution...');

        try {
            await this.domainService.processCommandAction(command.aggregateRootId, this.executeInternal, command, this.aggregateConstructor);
        } catch (e) {
            this.log("Error during Command Execution: ", "error");
            this.log((e as BaseException).getDetails?.() ?? e.message, "error");

            await this.domainService.evict(command.aggregateRootId);

            throw e;
        }

        this.log('Finished Executing Command.')
    };

    protected getContextName(): string {
        return this.constructor.name;
    }

    protected log(message: any, logLevel: LogLevel = "log", trace?: string) {
        switch (logLevel) {
            case "log": return this.logger.log(message, this.getContextName());
            case "debug": return this.logger.debug(message, this.getContextName());
            case "verbose": return this.logger.verbose(message, this.getContextName());
            case "warn": return this.logger.warn(message, this.getContextName());
            case "error": return this.logger.error(message, trace, this.getContextName());
        }
    }

    protected async getEntity(id: string): Promise<TEntity> {
        return this.entityRepository.findOne(id);
    }
}