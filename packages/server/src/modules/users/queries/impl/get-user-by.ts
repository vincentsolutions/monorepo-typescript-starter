import {BaseQuery} from "../../../core/base/queries/base.query";
import {FindConditions} from "typeorm/index";
import {User} from "../../user.entity";

export class GetUserByQuery extends BaseQuery {
    constructor(
        public readonly idOrCondition: string | FindConditions<User>
    ) {
        super();
    }
}