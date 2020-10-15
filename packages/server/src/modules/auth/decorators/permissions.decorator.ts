import {Permission} from "../../users/models/Permission";
import {SetMetadata} from "@nestjs/common";
import {JwtPermissionMatchMode} from "../guards/jwt-auth.guard";

export const Permissions = (...permissions: Permission[]) => SetMetadata('permissions', permissions);
export const PermissionMatchType = (matchMode: JwtPermissionMatchMode) => SetMetadata('permissionMatchMode', matchMode);