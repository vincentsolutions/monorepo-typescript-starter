import {User} from "./user.entity";
import {BaseRepository} from "../core/base/repositories/base.repository";
import {EntityRepository} from "typeorm/index";

@EntityRepository(User)
export class UserRepository extends BaseRepository<User> {

}