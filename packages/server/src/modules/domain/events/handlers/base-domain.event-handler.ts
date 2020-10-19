import {BaseDomainEvent} from "../impl/base-domain.event";
import {BaseEventHandler} from "./base.event-handler";

export abstract class BaseDomainEventHandler<TEvent extends BaseDomainEvent<any>> extends BaseEventHandler<TEvent> {
    protected abstract handleInternal(event: TEvent): Promise<void>;
}