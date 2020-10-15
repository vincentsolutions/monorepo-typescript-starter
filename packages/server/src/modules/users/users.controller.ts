import {
    Body,
    Controller, Delete,
    Get,
    HttpCode,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
    UseFilters,
    UseGuards
} from "@nestjs/common";
import {UserModel} from "./models/user.model";
import {DefaultValidationPipe} from "../core/pipes/validation/default-validation.pipe";
import {CreateUserDto} from "./dtos/create-user.dto";
import {UsersService} from "./users.service";
import {UpdateUserFirstNameCommand} from "./commands/impl/update-user-first-name.command";
import {UpdatePasswordDto} from "./dtos/update-password.dto";
import {DomainValidationExceptionFilter} from "../core/exceptions/filters/domain-validation.exception-filter";
import {BaseApiController} from "../core/base/controllers/base-api.controller";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {UpdateUserLastNameCommand} from "./commands/impl/update-user-last-name.command";
import {UpdateUserEmailCommand} from "./commands/impl/update-user-email.command";
import {UpdateUserPasswordCommand} from "./commands/impl/update-user-password.command";
import {UpdateUserPhoneNumberCommand} from "./commands/impl/update-user-phone-number.command";
import {Permission} from "./models/Permission";
import {Permissions} from "../auth/decorators/permissions.decorator";
import {PermissionsGuard} from "../auth/guards/permissions.guard";
import {OwnUserGuard} from "./guards/own-user.guard";

@UseFilters(DomainValidationExceptionFilter)
@UseGuards(JwtAuthGuard, PermissionsGuard, OwnUserGuard)
@Permissions(Permission.Default)
@Controller("users")
export class UsersController extends BaseApiController {
    constructor(
        private readonly userService: UsersService
    ) {
        super();
    }

    @Get()
    async findAll(): Promise<UserModel[]> {
        const result = await this.userService.findAll();

        return result.map(x => UserModel.fromEntity(x));
    }

    @Get('findByEmail')
    async findByEmail(@Query('email') email: string): Promise<UserModel> {
        const result = await this.userService.findByEmail(email);

        if (!result) {
            throw new NotFoundException();
        }

        return UserModel.fromEntity(result);
    }

    @Get(':id')
    async findById(@Param('id') id: string): Promise<UserModel> {
        const result = await this.userService.findById(id);

        if (!result) {
            throw new NotFoundException();
        }

        return UserModel.fromEntity(result);
    }

    @Post()
    async create(@Body(new DefaultValidationPipe()) dto: CreateUserDto) {
        const id = await this.userService.create(dto.firstName, dto.lastName, dto.email, dto.password, dto.phoneNumber);

        return this.findById(id);
    }

    @Put(':id/firstName')
    async updateFirstName(
        @Param("id") id: string,
        @Body("firstName") firstName: string
    ) {
        await this.sendCommands(
            new UpdateUserFirstNameCommand(id, firstName)
        )

        return this.findById(id);
    }

    @Put(':id/lastName')
    async updateLastName(
        @Param("id") id: string,
        @Body("lastName") lastName: string
    ) {
        await this.sendCommands(
            new UpdateUserLastNameCommand(id, lastName)
        );

        return this.findById(id);
    }

    @Put(':id/email')
    async updateEmail(
        @Param('id') id: string,
        @Body("email") email: string
    ) {
        await this.sendCommands(
            new UpdateUserEmailCommand(id, email)
        );

        return this.findById(id);
    }

    @Put(':id/password')
    async updatePassword(
        @Param('id') id: string,
        @Body(new DefaultValidationPipe()) dto: UpdatePasswordDto
    ) {
        await this.sendCommands(
            new UpdateUserPasswordCommand(id, dto.currentPassword, dto.newPassword)
        );
    }

    @Put(':id/phoneNumber')
    async updatePhoneNumber(
        @Param('id') id: string,
        @Body('phoneNumber') phoneNumber: string
    ) {
        await this.sendCommands(
            new UpdateUserPhoneNumberCommand(id, phoneNumber)
        )

        return this.findById(id);
    }

    @Put(':id/reactivate')
    @HttpCode(204)
    @Permissions(Permission.Admin)
    async reactivate(
        @Param('id') id: string
    ) {
        await this.userService.reactivate(id);
    }

    @Put(':id/deactivate')
    @HttpCode(204)
    @Permissions(Permission.Admin)
    async deactivate(
        @Param('id') id: string
    ) {
        await this.userService.deactivate(id);
    }

    @Post(':id/permissions')
    @HttpCode(204)
    @Permissions(Permission.SuperAdmin)
    async addPermissions(
        @Param('id') id: string,
        @Body('permissions') permissions: Permission[]
    ) {
        await this.userService.addPermissions(id, permissions);
    }

    @Delete(':id/permissions')
    @HttpCode(204)
    @Permissions(Permission.SuperAdmin)
    async removePermissions(
        @Param('id') id: string,
        @Body('permissions') permissions: Permission[]
    ) {
        await this.userService.removePermissions(id, permissions);
    }
}