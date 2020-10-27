import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {UsersService} from "../../users/users.service";
import {Reflector} from "@nestjs/core";
import {JwtPermissionMatchMode} from "./jwt-auth.guard";
import {Permission} from "@sharedKernel";

@Injectable()
export class PermissionsGuard implements CanActivate {

    constructor(
        private readonly usersService: UsersService,
        private readonly reflector: Reflector
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        const permissions = this.reflector.get<Permission[]>('permissions', context.getHandler()) ?? [ Permission.Default ];
        const matchMode = this.reflector.get<JwtPermissionMatchMode>('permissionMatchMode', context.getHandler()) ?? "all";

        if (permissions.length === 0) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        return this.matchRoles(permissions, user.permissions, matchMode);
    }

    matchRoles(requiredPermissions: Permission[], currentPermissions: Permission[], matchMode: JwtPermissionMatchMode): boolean {
        const permissionMatchResult: boolean[] = [];

        for (const permission of requiredPermissions) {
            permissionMatchResult.push(
                currentPermissions.includes(permission)
            )
        }

        let validationResult: boolean;

        switch (matchMode) {
            case "any":
                validationResult = permissionMatchResult.some(x => x === true);
                break;
            case "all":
            default:
                validationResult = permissionMatchResult.every(x => x === true);
                break;
        }

        if (!validationResult) {
            throw new UnauthorizedException('You do not have the required roles for this operation.')
        }

        return true;
    }

}