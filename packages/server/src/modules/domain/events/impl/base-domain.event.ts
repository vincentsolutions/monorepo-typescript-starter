import {BaseEvent} from "./base.event";
import {Event} from "geteventstore-promise/index";

export class BaseDomainEvent<TInterface extends {} = any> extends BaseEvent {
    public eventType: string;

    constructor(
        public readonly aggregateRootId: string,
        public readonly params?: TInterface,
        public version: number = 1,
        eventType?: string,
    ) {
        super();

        this.eventType = eventType ?? this.constructor.name;
    }

    public static fromEventStore(event: Event) {
        const dataAsBaseEvent = event.data as BaseDomainEvent;

        return new BaseDomainEvent(dataAsBaseEvent.aggregateRootId, dataAsBaseEvent.params, dataAsBaseEvent.version, dataAsBaseEvent.eventType);
    }
}