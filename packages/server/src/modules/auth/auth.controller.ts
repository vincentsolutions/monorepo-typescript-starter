import {Body, Controller, HttpCode, Post, Request, UseFilters, UseGuards} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {LocalAuthGuard} from "./guards/local-auth.guard";
import {DefaultValidationPipe} from "../core/pipes/validation/default-validation.pipe";
import {SignUpDto} from "./dto/sign-up.dto";
import {DomainValidationExceptionFilter} from "../core/exceptions/filters/domain-validation.exception-filter";

@UseFilters(DomainValidationExceptionFilter)
@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) {
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
