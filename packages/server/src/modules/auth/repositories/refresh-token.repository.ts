import {BaseRepository} from "../../core/base/repositories/base.repository";
import {RefreshToken} from "../entities/refresh-token.entity";
import {EntityRepository} from "typeorm/index";

@EntityRepository(RefreshToken)
export class RefreshTokenRepository extends BaseRepository<RefreshToken> {

}