import {Inject, Injectable, Scope} from "@nestjs/common";
import {AggregateRootConstructor, BaseAggregateRoot} from "../aggregate/base.aggregate-root";
import {BaseDomainCommand} from "../commands/impl/base-domain.command";
import {AggregateSnapshotService} from "./aggregate-snapshot.service";
import {BaseDomainEvent} from "../events/impl/base-domain.event";
import {EventStoreService} from "../../event-store/event-store.service";
import {Logger} from "@server/core";
import {REQUEST} from "@nestjs/core";
import {Request} from "express";
import {User} from "../../users/user.entity";
import {EventBus} from "@nestjs/cqrs";

@Injectable()
export class DomainService {
    private readonly _cache: Map<string, BaseAggregateRoot> = new Map<string, BaseAggregateRoot>();

    constructor(
        private readonly logger: Logger,
        private readonly snapshotService: AggregateSnapshotService,
        @Inject(EventStoreService) private readonly eventStoreService: EventStoreService,
        private readonly eventBus: EventBus
    ) {

    }

    async save<TAggregate extends BaseAggregateRoot>(aggregate: TAggregate) {
        this._cache.set(aggregate.id, aggregate);

        const uncommittedEvents = aggregate.getUncommittedChanges().slice();
        aggregate.markChangesAsCommitted();

        this.logger.log(`Processing ${uncommittedEvents.length} events`, DomainService.name);

        for (const event of uncommittedEvents) {
            event.date = new Date().toISOString();
            // event.byUserId = (this.request?.user as User)?.id;

            await this.eventBus.publish(event);

            aggregate.updateVersion(event.version);
        }

        if (aggregate.version !== 0) { // && aggregate.version % 100 === 0) {
            await this.snapshotService.updateSnapshot(aggregate);
        }
    }

    async processCommandAction<TAggregate extends BaseAggregateRoot, TCommand extends BaseDomainCommand>(
        aggregateRootId: string,
        action: (command: TCommand, aggregateRoot: TAggregate) => void,
        command: TCommand,
        aggregateConstructor: AggregateRootConstructor<TAggregate>
    ) {
        const aggregate = await this.getAggregateById(aggregateRootId, aggregateConstructor);

        await action(command, aggregate);
        await this.save(aggregate);
    }

    async getAggregateById<TAggregate extends BaseAggregateRoot>(id: string, aggregateConstructor: AggregateRootConstructor<TAggregate>): Promise<TAggregate> {
        return new Promise(async (resolve, reject) => {
            console.log('Attempting to resolve aggregate from cache...');
            const cachedAggregate = this._cache.get(id);

            if (cachedAggregate) {
                console.log('Resolved aggregate in cache successfully.');
                resolve(cachedAggregate as unknown as TAggregate);
                return;
            }

            console.log('Could not resolve aggregate in cache.');

            const aggregate = await this.snapshotService.rebuildAggregateFromSnapshot(id, aggregateConstructor);
            await this.loadAggregateFromEvents(aggregate)
            this._cache.set(id, aggregate);

            resolve(aggregate);
        });
    }

    async loadAggregateFromEvents<TAggregate extends BaseAggregateRoot>(aggregate: TAggregate) {
        console.log('Attempting to load event from event stream...')
        const events: BaseDomainEvent[] = await this.eventStoreService.getEventsForAggregate(aggregate.id, aggregate.constructor.name, 4096, aggregate.version);
        console.log(`Loaded ${events.length} events. Applying to aggregate...`);

        aggregate.loadFromHistory(events);
    }

    async evict(aggregateId: string) {
        this.logger.log("Starting Aggregate Evicting Process");
        this._cache.delete(aggregateId);

        try {
            await this.snapshotService.deleteSnapshot(aggregateId);
        }
        catch (e) {
            this.logger.error(e);
        }
    }
}