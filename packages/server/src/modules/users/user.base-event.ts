import {BaseDomainEvent} from "../domain/events/impl/base-domain.event";
import {UserAggregateRoot} from "./user.aggregate";

export abstract class BaseUserEvent<TInterface extends {} = any> extends BaseDomainEvent<TInterface> {
    constructor(
        aggregateRootId: string,
        params: TInterface = {} as any,
        version: number = 1
    ) {
        super(aggregateRootId, params, UserAggregateRoot.name, version);
    }

    public static fromEventStore
}