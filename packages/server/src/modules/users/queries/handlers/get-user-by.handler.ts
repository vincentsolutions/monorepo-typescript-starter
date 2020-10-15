import {BaseQueryHandler} from "../../../core/base/queries/base.query-handler";
import {GetUserByQuery} from "../impl/get-user-by";
import {User} from "../../user.entity";
import {Connection} from "typeorm/index";
import {QueryHandler} from "@nestjs/cqrs";

@QueryHandler(GetUserByQuery)
export class GetUserByQueryHandler extends BaseQueryHandler<GetUserByQuery, User, User | undefined> {

    constructor(
        connection: Connection
    ) {
        super(User, connection);
    }

    protected async executeInternal(query: GetUserByQuery): Promise<User | undefined> {

        if (typeof query.idOrCondition === "string") {
            return await this.entityRepository.findOne(query.idOrCondition);
        }

        return await this.entityRepository.findOne(query.idOrCondition)
    }
}