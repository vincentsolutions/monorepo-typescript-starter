import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy, StrategyOptions} from "passport-jwt";
import {Injectable, UnauthorizedException} from "@nestjs/common";
import {authConstants} from "../../constants";
import {JwtPayload} from "./jwt.payload";
import {UsersService} from "../../../users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly usersService: UsersService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: authConstants.accessToken.secret
        } as StrategyOptions);
    }

    async validate(payload: JwtPayload) {
        // TODO: Validate

        const user = await this.usersService.findById(payload.sub);

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}