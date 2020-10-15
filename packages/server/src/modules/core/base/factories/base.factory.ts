import {BaseAggregateRoot} from "../domain/base.aggregate-root";
import {BaseEntity} from "../entities/base-entity";

export abstract class BaseFactory<
    TAggregate extends BaseAggregateRoot,
    TEntity extends BaseEntity,
    TCreateParams
> {
    public abstract createFrom(entity: TEntity): TAggregate;
    public abstract createWith(aggregateRootId: string, params: TCreateParams): Promise<TAggregate>;
}