import {Body, Controller, HttpCode, Post, UseGuards, Res, Req, HttpStatus} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {LocalAuthGuard} from "./guards/local-auth.guard";
import {DefaultValidationPipe} from "../core/pipes/validation/default-validation.pipe";
import {SignUpDto} from "./dto/sign-up.dto";
import {BaseApiController} from "../core/base/controllers/base-api.controller";
import {RefreshTokenAuthGuard} from "./guards/refresh-token-auth.guard";
import {Response} from "express";
import {authConstants} from "./auth.constants";

@Controller('auth')
export class AuthController extends BaseApiController {

    constructor(
        private readonly authService: AuthService
    ) {
        super();
    }

    @Post('signUp')
    async signUp(@Body(DefaultValidationPipe) dto: SignUpDto) {
        return this.authService.signUp(dto);
    }

    @UseGuards(LocalAuthGuard)
    @Post('signIn')
    @HttpCode(200)
    async signIn(@Req() req, @Res() res: Response) {
        return await this.handleAuth(req, res);
    }

    @UseGuards(RefreshTokenAuthGuard)
    @Post('requestAccessToken')
    @HttpCode(200)
    async requestAccessToken(@Req() req, @Res() res: Response) {
        return await this.handleAuth(req, res);
    }

    private async handleAuth(req, res: Response) {
        const { accessToken, accessTokenExpiresAt, refreshToken, cookieConfig } = await this.authService.getAuthTokens(req.user);

        res.cookie(authConstants.refreshToken.cookieKey, refreshToken, {
            ...cookieConfig,
            signed: true
        });

        res.status(HttpStatus.OK).json({
            accessToken,
            accessTokenExpiresAt
        });
    }
}
