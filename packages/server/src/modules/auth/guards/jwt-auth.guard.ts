import {AuthGuard} from "@nestjs/passport";
import {Injectable, UnauthorizedException} from "@nestjs/common";
import {UsersService} from "../../users/users.service";
import {User} from "../../users/user.entity";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(
        private readonly usersService: UsersService
    ) {
        super();
    }

    handleRequest(err, user, inf: Error) {
        console.log(err, user, inf);
        if (err || !user) {
            throw err || new UnauthorizedException();

        }

        this.validateUserState(user);

        return user;
    }

    private validateUserState(user: User): boolean {
        if (!user.isActive) {
            throw new UnauthorizedException('Your user is not currently active');
        }

        return true;
    }

    // private validatePermissions(user: JwtPayload): boolean {
    //     if (this.permissions.length === 0) {
    //         return true;
    //     }
    //
    //     const permissionMatchResult: boolean[] = [];
    //
    //     for (const permission of this.permissions) {
    //         permissionMatchResult.push(
    //             user.permissions.includes(permission)
    //         )
    //     }
    //
    //     let validationResult: boolean;
    //
    //     switch (this.permissionMatchMode) {
    //         case "any":
    //             validationResult = permissionMatchResult.some(x => x === true);
    //             break;
    //         case "all":
    //         default:
    //             validationResult = permissionMatchResult.every(x => x === true);
    //             break;
    //     }
    //
    //     if (!validationResult) {
    //         throw new UnauthorizedException('You do not have the required roles for this operation.')
    //     }
    //
    //     return true;
    // }
}

export type JwtPermissionMatchMode = 'all' | 'any';