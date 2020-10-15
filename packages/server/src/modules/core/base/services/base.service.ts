import {BaseEntity} from "../entities/base-entity";
import {CommandBus, QueryBus} from "@nestjs/cqrs";
import {Inject} from "@nestjs/common";
import {BaseQuery} from "../queries/base.query";

export abstract class BaseService<TEntity extends BaseEntity> {
    @Inject() protected readonly commandBus: CommandBus;
    @Inject() protected readonly queryBus: QueryBus;

    protected constructor() {

    }


    public abstract findAll(): Promise<TEntity[]>;
    public abstract findById(id: string): Promise<TEntity | undefined>;

    protected async executeQuery<TResult, TQuery extends BaseQuery = BaseQuery>(query: TQuery) {
        return await this.queryBus.execute<TQuery, TResult>(query);
    }
}