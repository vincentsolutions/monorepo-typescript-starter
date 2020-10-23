import {Body, Controller, HttpCode, Post, Request, UseFilters, UseGuards} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {LocalAuthGuard} from "./guards/local-auth.guard";
import {DefaultValidationPipe} from "../core/pipes/validation/default-validation.pipe";
import {SignUpDto} from "./dto/sign-up.dto";
import {BaseApiController} from "../core/base/controllers/base-api.controller";

@Controller('auth')
export class AuthController extends BaseApiController {

    constructor(
        private readonly authService: AuthService
    ) {
        super();
    }

    @UseGuards(LocalAuthGuard)
    @Post('signIn')
    @HttpCode(200)
    async signIn(@Request() req) {
        return this.authService.signIn(req.user);
    }

    @Post('signUp')
    async signUp(@Body(DefaultValidationPipe) dto: SignUpDto) {
        return this.authService.signUp(dto);
    }
}
