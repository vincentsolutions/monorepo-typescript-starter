import {BaseDto} from "../../core/base/dtos/base.dto";
import {IsString, MinLength} from "class-validator";

export class UpdatePasswordDto extends BaseDto {
    @IsString()
    readonly currentPassword: string;

    @IsString()
    @MinLength(8)
    readonly newPassword: string;
}