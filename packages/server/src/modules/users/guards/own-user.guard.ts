import {Permission} from "../models/Permission";
import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {Request} from "express";
import {User} from "../user.entity";

@Injectable()
export class OwnUserGuard implements CanActivate {

    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const user = request.user as User;

        if (user.permissions.includes(Permission.SuperAdmin)) {
            return true;
        }

        const requestId = request.params['id'];

        return user.id === requestId;
    }
}