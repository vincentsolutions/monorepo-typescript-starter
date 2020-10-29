import {BaseDto} from "../../core/base/dtos/base.dto";
import {IsEmail, IsOptional, IsString, Matches, MinLength} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class SignUpDto extends BaseDto {
    @IsString()
    @IsEmail()
    @ApiProperty()
    readonly email: string;

    @IsString()
    @ApiProperty()
    @MinLength(8)
    @Matches(/(?=.*[a-z])/)
    @Matches(/(?=.*[A-Z])/)
    @Matches(/(?=.*\d)/)
    readonly password: string;

    @IsString()
    @ApiProperty()
    readonly firstName: string;

    @IsString()
    @ApiProperty()
    readonly lastName: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    readonly phoneNumber?: string;
}