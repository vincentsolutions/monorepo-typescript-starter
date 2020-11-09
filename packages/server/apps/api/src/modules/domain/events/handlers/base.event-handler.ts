import {IEventHandler} from "@nestjs/cqrs";
import {Inject} from "@nestjs/common";
import {Logger} from "@server/core";
import {Gateway} from "../../../gateway/gateway.service";
import {BaseDomainEvent} from "../impl/base-domain.event";
import {Connection, ObjectType} from "typeorm/index";
import {DomainService} from "../../services/domain.service";
import {BaseRepository} from "../../../core/base/repositories/base.repository";

export abstract class BaseEventHandler<TEvent extends BaseDomainEvent, TRepository extends BaseRepository> implements IEventHandler<TEvent> {
    @Inject() protected readonly logger: Logger;
    @Inject() protected readonly gateway: Gateway;
    @Inject() protected readonly domainService: DomainService;

    protected readonly entityRepository: TRepository

    protected constructor(
        repositoryType: ObjectType<TRepository>,
        connection: Connection
    ) {
        this.entityRepository = connection.getCustomRepository(repositoryType);
    }

    protected abstract handleInternal(event: TEvent): Promise<void>;

    // @Transaction()
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

        this.logger.log('Completed Event Handling.', this.getContextName());
    }

    protected getContextName(): string {
        return this.constructor.name;
    }
}