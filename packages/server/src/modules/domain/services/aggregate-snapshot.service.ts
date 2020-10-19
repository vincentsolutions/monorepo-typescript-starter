import {AggregateRootConstructor, BaseAggregateRoot} from "../aggregate/base.aggregate-root";
import {InjectRepository} from "@nestjs/typeorm";
import {AggregateSnapshot} from "../entities/aggregate-snapshot.entity";
import {Repository} from "typeorm/index";

export class AggregateSnapshotService {

    constructor(
        @InjectRepository(AggregateSnapshot) private readonly snapshotRepository: Repository<AggregateSnapshot>
    ) {
    }

    async rebuildAggregateFromSnapshot<TAggregate extends BaseAggregateRoot>(
        aggregateRootId: string,
        aggregateConstructor: AggregateRootConstructor<TAggregate>
    ) {
        console.log('Attempting to rebuild aggregate from snapshot')

        if (await this.snapshotRepository.count({ where: { aggregateRootId } }) === 1) {
            const snapshot = await this.snapshotRepository.findOne(aggregateRootId);
            console.log('Found a snapshot, rebuilding...');
            return new aggregateConstructor(aggregateRootId, snapshot.aggregateSnapshot, snapshot.version);
        }

        console.log('Could not find a snapshot, creating new.');
        return new aggregateConstructor(aggregateRootId, {});
    }

    async updateSnapshot<TAggregate extends BaseAggregateRoot>(aggregate: TAggregate) {
        const snapshot = await this.snapshotRepository.findOne(aggregate.id) ?? new AggregateSnapshot(aggregate.id);

        snapshot.version = aggregate.version;
        snapshot.aggregateSnapshot = this.convertAggregateToSnapshot(aggregate);

        await this.snapshotRepository.save(snapshot);
    }

    async deleteSnapshot(aggregateId: string) {
        await this.snapshotRepository.delete(aggregateId);
    }

    private convertAggregateToSnapshot<TAggregate extends BaseAggregateRoot>(aggregate: TAggregate): Record<string, any> {
        const record: Record<string, any> = {};

        for (const key of Object.keys(aggregate)) {
            if (typeof aggregate[key] !== 'function') {
                record[key] = aggregate[key];
            }
        }

        return record;
    }
}