import {Injectable} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {CryptoService} from "../core/services/crypto.service";
import {JwtService} from "@nestjs/jwt";
import {User} from "../users/user.entity";
import {SignUpDto} from "./dto/sign-up.dto";
import {JwtPayload} from "./strategies/jwt/jwt.payload";
import {Permission} from "@sharedKernel";
import {TokenService} from "./services/token.service";
import * as moment from 'moment';
import {authConstants} from "./auth.constants";

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly cryptoService: CryptoService,
        private readonly jwtService: JwtService,
        private readonly tokenService: TokenService
    ) {}

    async validateUser(username: string, password: string) {
        const user = await this.usersService.findByEmail(username);

        if (user && await this.cryptoService.comparePassword(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }

        return null;
    }

    async getAuthTokens(user: User) {
        const payload = this.buildPayloadFrom(user);

        const refreshTokenResult = await this.tokenService.requestRefreshToken(payload.sub);

        return {
            accessToken: this.jwtService.sign(payload),
            accessTokenExpiresAt: moment().add(authConstants.accessToken.durationInSec, 'seconds').unix(),
            ...refreshTokenResult
        }
    }

    async signUp(dto: SignUpDto) {
        const id = await this.usersService.create(dto.firstName, dto.lastName, dto.email, dto.password, dto.phoneNumber, [ Permission.Default ]);
        const user = await this.usersService.findById(id);

        return await this.getAuthTokens(user);
    }

    private buildPayloadFrom(user: User): JwtPayload {
        return {
            sub: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            isActive: user.isActive,
            permissions: user.permissions
        }
    }
}
