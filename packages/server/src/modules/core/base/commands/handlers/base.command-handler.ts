import {EventPublisher, ICommandHandler} from "@nestjs/cqrs";
import {Inject, Logger} from "@nestjs/common";
import {Connection, Repository} from "typeorm/index";
import {EntityClassOrSchema} from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import {BaseDomainEntity} from "../../entities/base-domain-entity";
import {BaseFactory} from "../../factories/base.factory";
import {BaseAggregateRoot} from "../../domain/base.aggregate-root";
import {BaseDomainCommand} from "../impl/base-domain.command";

export abstract class BaseCommandHandler<
    TCommand extends BaseDomainCommand<any>,
    TEntity extends BaseDomainEntity,
    TAggregate extends BaseAggregateRoot,
    TFactory extends BaseFactory<TAggregate, TEntity, any>
> implements ICommandHandler<TCommand> {
    @Inject(EventPublisher) protected readonly publisher: EventPublisher;
    @Inject(Logger) protected readonly logger: Logger;

    protected readonly entityRepository: Repository<TEntity>;

    protected constructor(
        entityClass: EntityClassOrSchema,
        protected readonly aggregateFactory: TFactory,
        protected readonly connection: Connection
    ) {
        this.entityRepository = connection.getRepository(entityClass);
    }

    protected abstract executeInternal(command: TCommand): Promise<void>;

    public async execute(command: TCommand): Promise<any> {
        this.logger.log('Starting Command Execution...', this.getContextName());

        try {
            await this.executeInternal(command);
        } catch (e) {
            this.logger.error("Error during Command Execution: ", undefined, this.getContextName());
            this.logger.error(e.getInfo?.() ?? e.message, undefined, this.getContextName());

            throw e;
        }

        this.logger.log('Finished Executing Command.', this.getContextName());
    };

    protected getContextName(): string {
        return this.constructor.name;
    }

    protected async getEntity(id: string): Promise<TEntity> {
        return this.entityRepository.findOne(id);
    }

    protected async initAggregateRootFromCreateCommand(id: string, command: TCommand): Promise<TAggregate> {
        return this.publisher.mergeObjectContext(
            await this.aggregateFactory.createWith(id, command.toObject())
        );
    }

    protected async getAggregateRootFromEntity(id: string, entity?: TEntity): Promise<TAggregate> {
        return this.publisher.mergeObjectContext(
            await this.aggregateFactory.createFrom(entity ?? await this.getEntity(id))
        )
    }
}