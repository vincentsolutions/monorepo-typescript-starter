import {BaseQueryHandler} from "../../../core/base/queries/base.query-handler";
import {GetUsersQuery} from "../impl/get-users.query";
import {QueryHandler} from "@nestjs/cqrs";
import {User} from "../../user.entity";
import {Connection} from "typeorm/index";

@QueryHandler(GetUsersQuery)
export class GetUsersQueryHandler extends BaseQueryHandler<GetUsersQuery, User, User[]> {

    constructor(
        connection: Connection
    ) {
        super(User, connection);
    }

    async executeInternal(query: GetUsersQuery): Promise<User[]> {
        return await this.entityRepository.find();
    }
}