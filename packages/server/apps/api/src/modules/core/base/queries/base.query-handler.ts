import {IQuery, IQueryHandler} from "@nestjs/cqrs";
import {BaseDomainEntity} from "../entities/base-domain-entity";
import {Inject} from "@nestjs/common";
import {Connection, Repository} from "typeorm/index";
import {EntityClassOrSchema} from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import {Logger} from "@server/core";

export abstract class BaseQueryHandler<TQuery extends IQuery, TEntity extends BaseDomainEntity, TRes = any> implements IQueryHandler<TQuery, TRes> {
    @Inject(Logger) protected readonly logger: Logger;

    protected readonly entityRepository: Repository<TEntity>;

    protected constructor(
        entityClass: EntityClassOrSchema,
        protected readonly connection: Connection
    ) {
        this.entityRepository = connection.getRepository(entityClass);
    }

    protected abstract executeInternal(query: TQuery): Promise<TRes>;

    public async execute(query: TQuery): Promise<TRes> {
        this.logger.log('Starting Query Execution...', this.getContextName());

        let result: TRes;

        try {
            result = await this.executeInternal(query);
        } catch (e) {
            this.logger.error("Error during Query Execution: ", undefined, this.getContextName());
            this.logger.error(e.getInfo?.() ?? e.message, undefined, this.getContextName());

            throw e;
        }

        this.logger.log('Finished Executing Query.', this.getContextName());

        return result;
    };

    protected getContextName(): string {
        return this.constructor.name;
    }
}