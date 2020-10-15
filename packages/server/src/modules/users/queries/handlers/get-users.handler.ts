import {BaseQueryHandler} from "../../../core/base/queries/base.query-handler";
import {GetUsersQuery} from "../impl/get-users.query";
import {UserModel} from "../../models/user.model";
import {QueryHandler} from "@nestjs/cqrs";
import {User} from "../../user.entity";
import {Connection} from "typeorm/index";

@QueryHandler(GetUsersQuery)
export class GetUsersQueryHandler extends BaseQueryHandler<GetUsersQuery, User, UserModel[]> {

    constructor(
        connection: Connection
    ) {
        super(User, connection);
    }

    async executeInternal(query: GetUsersQuery): Promise<UserModel[]> {
        return await this.entityRepository.find();
    }
}