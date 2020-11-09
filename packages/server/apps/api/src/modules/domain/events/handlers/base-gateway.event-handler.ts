import {IEventHandler} from "@nestjs/cqrs";
import {BaseDomainEvent} from "../impl/base-domain.event";
import {Inject} from "@nestjs/common";
import {Logger} from "@server/core";
import {Gateway} from "../../../gateway/gateway.service";

export abstract class BaseGatewayEventHandler<TEvent extends BaseDomainEvent> implements IEventHandler<TEvent> {
    @Inject() private readonly logger: Logger;
    @Inject() private readonly gateway: Gateway;

    protected abstract async getAudience(event: TEvent): Promise<string[]>;

    public async handle(event: TEvent) {
        this.logger.log('Starting Gateway Event Handling...', this.getContextName());

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