import {BaseRepository} from "../../core/base/repositories/base.repository";
import {AggregateSnapshot} from "../entities/aggregate-snapshot.entity";
import {EntityRepository} from "typeorm/index";

@EntityRepository(AggregateSnapshot)
export class AggregateSnapshotRepository extends BaseRepository<AggregateSnapshot> {

}