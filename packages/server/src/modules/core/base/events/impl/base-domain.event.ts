import {BaseEvent} from "./base.event";

export class BaseDomainEvent<TInterface extends {}> extends BaseEvent {
    constructor(
        public readonly aggregateRootId: string,
        public readonly params?: TInterface
    ) {
        super();
    }
}