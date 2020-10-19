import {Injectable} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {CryptoService} from "../core/services/crypto.service";
import {JwtService} from "@nestjs/jwt";
import {User} from "../users/user.entity";
import {SignUpDto} from "./dto/sign-up.dto";
import {Permission} from "../users/models/Permission";
import {JwtPayload} from "./strategies/jwt/jwt.payload";

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly cryptoService: CryptoService,
        private readonly jwtService: JwtService
    ) {}

    async validateUser(username: string, password: string) {
        const user = await this.usersService.findByEmail(username);

        if (user && await this.cryptoService.comparePassword(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }

        return null;
    }

    async signIn(user: User) {
        const payload = this.buildPayloadFrom(user);

        return {
            accessToken: this.jwtService.sign(payload)
        }
    }

    async signUp(dto: SignUpDto) {
        const id = await this.usersService.create(dto.firstName, dto.lastName, dto.email, dto.password, dto.phoneNumber, [ Permission.Default ]);
        const user = await this.usersService.findById(id);

        const payload = this.buildPayloadFrom(user);

        return {
            accessToken: this.jwtService.sign(payload)
        }
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
