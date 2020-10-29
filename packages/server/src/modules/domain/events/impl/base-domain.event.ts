import {BaseEvent} from "./base.event";
import {Event} from "geteventstore-promise/index";
import {IDomainEvent} from "@sharedKernel";

export class BaseDomainEvent<TParams extends {} = any> extends BaseEvent implements IDomainEvent<TParams> {
    public readonly eventType: string;
    public byUserId: string;
    public date: string;

    constructor(
        public readonly aggregateRootId: string,
        public readonly params: TParams = {} as any,
        public readonly aggregateName: string,
        public version: number = 1,
        eventType?: string,
    ) {
        super();

        this.eventType = eventType ?? this.constructor.name;
    }

    public get streamName(): string {
        return `${this.aggregateName}-${this.aggregateRootId}`;
    }

    public static fromEventStore(event: Event) {
        const { aggregateRootId, eventType, params, aggregateName, version } = event.data as BaseDomainEvent;

        return new this(aggregateRootId, params, aggregateName, version, eventType);
    }
}