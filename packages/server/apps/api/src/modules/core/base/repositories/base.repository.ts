import {EntityManager, getManager, Repository} from "typeorm/index";
import {getNamespace} from "cls-hooked";
import {typeOrmEntityManagerKey} from "../../decorators/transaction.decorator";
import {BaseEntity} from "../entities/base-entity";
import {coreConstants} from "@server/core";

export abstract class BaseRepository<TEntity extends BaseEntity = BaseEntity> extends Repository<TEntity> {

    public get manager(): EntityManager {
        const context = getNamespace(coreConstants.transactionContextNamespace);

        if (context && context.active) {
            const transactionalEntityManager = context.get(typeOrmEntityManagerKey);

            if (transactionalEntityManager) {
                return transactionalEntityManager;
            }
        }

        return getManager();
    }

    public set manager(value: EntityManager) {

    }
}