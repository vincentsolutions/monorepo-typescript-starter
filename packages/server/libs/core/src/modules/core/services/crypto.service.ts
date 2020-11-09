import {compare, hash} from "bcrypt";
import {Injectable} from "@nestjs/common";

@Injectable()
export class CryptoService {
    private readonly saltRounds: number = 10;

    async comparePassword(plainTextPassword: string, hashedPassword: string) {
        return await compare(plainTextPassword, hashedPassword);
    }

    async hashPassword(password: string) {
        return await hash(password, this.saltRounds);
    }
}