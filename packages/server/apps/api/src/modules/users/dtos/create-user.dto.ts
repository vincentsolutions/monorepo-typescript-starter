import {IsEmail, IsString, MinLength} from "class-validator";
import {BaseDto} from "../../core/base/dtos/base.dto";
import {ApiProperty} from "@nestjs/swagger";

export class CreateUserDto extends BaseDto {
    @IsString()
    @ApiProperty()
    readonly firstName: string;

    @IsString()
    @ApiProperty()
    readonly lastName: string;

    @IsEmail()
    @ApiProperty()
    readonly email: string;

    @ApiProperty()
    readonly phoneNumber?: string;

    @IsString()
    @MinLength(8)
    @ApiProperty()
    readonly password: string;
}