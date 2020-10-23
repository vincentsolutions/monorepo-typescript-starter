import {BaseDto} from "../../core/base/dtos/base.dto";
import {IsEmail, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class SignInDto extends BaseDto {
    @IsString()
    @IsEmail()
    @ApiProperty()
    readonly email: string;

    @IsString()
    @ApiProperty()
    readonly password: string;
}