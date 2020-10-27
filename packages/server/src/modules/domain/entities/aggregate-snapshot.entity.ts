import {Column, Entity, PrimaryColumn, VersionColumn} from "typeorm/index";
import {BaseEntity} from "../../core/base/entities/base-entity";

@Entity("aggregate_snapshot")
export class AggregateSnapshot extends BaseEntity {
    @PrimaryColumn()
    aggregateRootId: string;

    @VersionColumn()
    version: number;

    @Column("jsonb")
    aggregateSnapshot: Record<string, any>;

    constructor(aggregateRootId?: string) {
        super();

        this.aggregateRootId = aggregateRootId;
    }
}