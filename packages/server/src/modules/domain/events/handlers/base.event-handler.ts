import {IEventHandler} from "@nestjs/cqrs";
import {BaseEvent} from "../impl/base.event";
import {Inject} from "@nestjs/common";
import {Logger} from "../../../core/services/logger.service";
import {Gateway} from "../../../gateway/gateway.service";

export abstract class BaseEventHandler<TEvent extends BaseEvent> implements IEventHandler<TEvent> {
    @Inject() protected readonly logger: Logger;
    @Inject() protected readonly gateway: Gateway;

    protected abstract handleInternal(event: TEvent): Promise<void>;

    public async handle(event: TEvent) {
        this.logger.log('Starting Event Handling...', this.getContextName());

            try {
                await this.handleInternal(event);
                await this.gateway.server.emit(Object.getPrototypeOf(event).constructor.name, JSON.stringify(event));

            } catch (e) {
                this.logger.error('Error during Event Handling: ', undefined, this.getContextName());
                this.logger.error(e.getInfo(), undefined, this.getContextName());
                throw e;
            }

        this.logger.log('Completed Event Handling.', this.getContextName());
    }

    protected getContextName(): string {
        return this.constructor.name;
    }
}