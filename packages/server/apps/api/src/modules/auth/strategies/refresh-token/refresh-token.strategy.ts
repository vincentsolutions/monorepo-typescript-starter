import {Injectable, NotFoundException, UnauthorizedException} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import { Strategy } from 'passport-cookie';
import {UsersService} from "../../../users/users.service";
import {Request} from "express";
import {User} from "../../../users/user.entity";
import {Logger} from "@server/core";
import {TokenService} from "../../services/token.service";
import {authConstants} from "../../auth.constants";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh-token') {
    constructor(
        private readonly tokenService: TokenService,
        private readonly usersService: UsersService,
        private readonly logger: Logger
    ) {
        super({
            cookieName: authConstants.refreshToken.cookieKey,
            signed: true,
            passReqToCallback: true
        }, (req, token, done) => this.validate(req, token, done));
    }

    validate = async (req: Request, token: string, done: (err: Error, res: User | false) => void) => {
        this.logger.log(`Validating token: ${token}`);

        const refreshTokenEntity = await this.tokenService.findRefreshTokenEntity(token);

        if (!refreshTokenEntity) {
            return done(new NotFoundException("Refresh Token couldn't be found in the DB."), null);
        }

        const validationResult = this.tokenService.validateRefreshToken(refreshTokenEntity);

        if (!validationResult) {
            return done(new UnauthorizedException("Refresh Token is not valid"), null);
        }

        const userEntity = await this.usersService.findById(refreshTokenEntity.userId);

        if (!userEntity) {
            return done(null, false);
        }

        return done(null, userEntity);
    }
}