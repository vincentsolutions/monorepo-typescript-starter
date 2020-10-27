import {IEventHandler} from "@nestjs/cqrs";
import {Inject} from "@nestjs/common";
import {Logger} from "../../../core/services/logger.service";
import {Gateway} from "../../../gateway/gateway.service";
import {BaseDomainEvent} from "../impl/base-domain.event";
import {Transaction} from "../../../core/decorators/transaction.decorator";
import {Connection, ObjectType} from "typeorm/index";
import {BaseRepository} from "../../../core/base/repositories/base.repository";
import {DomainService} from "../../services/domain.service";

export abstract class BaseEventHandler<TEvent extends BaseDomainEvent, TRepository extends BaseRepository> implements IEventHandler<TEvent> {
    @Inject() protected readonly logger: Logger;
    @Inject() protected readonly gateway: Gateway;
    @Inject() protected readonly domainService: DomainService;

    protected readonly entityRepository: TRepository

    protected constructor(
        repository: ObjectType<TRepository>,
        connection: Connection
    ) {
        this.entityRepository = connection.getCustomRepository(repository);
    }

    protected abstract handleInternal(event: TEvent): Promise<void>;

    @Transaction()
    public async handle(event: TEvent) {
        this.logger.log('Starting Event Handling...', this.getContextName());

        try {
            await this.handleInternal(event);
        } catch (e) {
            this.logger.error('Error during Event Handling: ', undefined, this.getContextName());
            this.logger.error(e.getInfo?.() ?? e.message, undefined, this.getContextName());

            await this.domainService.evict(event.aggregateRootId);

            throw e;
        }

        try {
            this.gateway.emitToUser(event.aggregateRootId, Object.getPrototypeOf(event).constructor.name, JSON.stringify(event));
        } catch (e) {
            this.logger.warn('Error while emitting event from gateway to user', this.getContextName());
            this.logger.warn(e.getInfo?.() ?? e.message, this.getContextName());
        }

        this.logger.log('Completed Event Handling.', this.getContextName());
    }

    protected getContextName(): string {
        return this.constructor.name;
    }
}