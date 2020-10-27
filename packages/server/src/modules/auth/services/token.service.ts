import {Injectable} from "@nestjs/common";
import {Logger} from "../../core/services/logger.service";
import {InjectRepository} from "@nestjs/typeorm";
import {RefreshToken} from "../entities/refresh-token.entity";
import {CookieOptions} from "express";
import {v4} from "uuid";
import * as moment from "moment";
import {Moment} from 'moment';
import {Config} from "../../core/config/config";
import {Environment} from "@sharedKernel";
import {authConstants} from "../constants";
import {RefreshTokenRepository} from "../repositories/refresh-token.repository";

@Injectable()
export class TokenService {
    constructor(
        @InjectRepository(RefreshTokenRepository) private readonly refreshTokenRepository: RefreshTokenRepository,
        private readonly logger: Logger,
        private readonly config: Config
    ) {}

    async findRefreshTokenEntity(token: string): Promise<RefreshToken | undefined> {
        return await this.refreshTokenRepository.findOne({ refreshToken: token });
    }

    validateRefreshToken(refreshToken: RefreshToken): boolean {
        // TODO: Validate RefreshToken

        return true;
    }

    public async requestRefreshToken(userId: string): Promise<{ refreshToken: string, cookieConfig: CookieOptions }> {
        await this.invalidateRefreshToken(userId);

        const tokenInfo = await this.generateRefreshToken();

        await this.refreshTokenRepository.save(new RefreshToken(userId, tokenInfo.refreshToken, tokenInfo.refreshTokenExpiresAt.toISOString()));

        return tokenInfo;
    }

    private async generateRefreshToken(): Promise<IRefreshTokenGenerationResult> {
        const expiration = moment().add(authConstants.refreshToken.durationInDays, 'days');

        return {
            refreshToken: v4(),
            refreshTokenExpiresAt: expiration,
            cookieConfig: {
                expires: expiration.toDate(),
                httpOnly: true,
                sameSite: 'lax',
                secure: this.config.ENVIRONMENT !== Environment.LOCAL
            }
        }
    }

    async invalidateRefreshToken(userId: string): Promise<void> {
        const existingRefreshTokensForUser = await this.refreshTokenRepository.find({ userId });

        if (existingRefreshTokensForUser.length > 0) {
            await this.refreshTokenRepository.remove(existingRefreshTokensForUser);
        }

        return;
    }
}

export interface IRefreshTokenGenerationResult {
    refreshToken: string;
    refreshTokenExpiresAt: Moment;
    cookieConfig: CookieOptions;
}