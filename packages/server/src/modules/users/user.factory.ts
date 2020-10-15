import {User} from "./user.entity";
import {UserAggregateRoot} from "./domain/user.aggregate";
import {ICreateUser} from "./commands/impl/create-user.command";
import {CryptoService} from "../core/services/crypto.service";
import {BaseFactory} from "../core/base/factories/base.factory";
import {Injectable} from "@nestjs/common";

@Injectable()
export class UserFactory extends BaseFactory<UserAggregateRoot, User, ICreateUser> {
    constructor(
        private readonly cryptoService: CryptoService
    ) {
        super();
    }

    public createFrom(entity: User): UserAggregateRoot {
        return new UserAggregateRoot(entity.id, entity);
    }

    public async createWith(aggregateRootId: string, params: ICreateUser): Promise<UserAggregateRoot> {
        const aggregate = new UserAggregateRoot(aggregateRootId, params);

        const hashedPassword = await this.cryptoService.hashPassword(params.password);

        const paramsWithHash: ICreateUser = {
            ...params,
            password: hashedPassword
        }

        aggregate.markAsCreated(paramsWithHash);

        return aggregate;
    }
}