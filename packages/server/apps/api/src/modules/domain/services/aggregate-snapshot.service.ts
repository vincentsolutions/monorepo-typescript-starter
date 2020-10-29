import {AggregateRootConstructor, BaseAggregateRoot} from "../aggregate/base.aggregate-root";
import {InjectRepository} from "@nestjs/typeorm";
import {AggregateSnapshot} from "../entities/aggregate-snapshot.entity";
import {Repository} from "typeorm/index";
import {AggregateSnapshotRepository} from "../repositories/aggregate-snapshot.repository";

export class AggregateSnapshotService {

    constructor(
        @InjectRepository(AggregateSnapshotRepository) private readonly snapshotRepository: AggregateSnapshotRepository
    ) {
    }

    async rebuildAggregateFromSnapshot<TAggregate extends BaseAggregateRoot>(
        aggregateRootId: string,
        aggregateConstructor: AggregateRootConstructor<TAggregate>
    ) {
        if (await this.snapshotRepository.count({ where: { aggregateRootId } }) === 1) {
            const snapshot = await this.snapshotRepository.findOne(aggregateRootId);
            return new aggregateConstructor(aggregateRootId, snapshot.aggregateSnapshot, snapshot.version);
        }

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