import {BaseAggregateRoot} from "../../src/modules/domain/aggregate/base.aggregate-root";
import {BaseDomainEvent} from "../../src/modules/domain/events/impl/base-domain.event";

export function checkEventInAggregate(aggregate: BaseAggregateRoot, EventClass: { new(aggregateRootId: string, params: any): BaseDomainEvent }) {
    expect(aggregate.getUncommittedChanges().length).toBe(1);

    const event = aggregate.getUncommittedChanges()[0];

    expect(event.eventType).toBe(EventClass.name);
    expect(event).toBeInstanceOf(EventClass);
}