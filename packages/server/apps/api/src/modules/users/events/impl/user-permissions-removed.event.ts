import {BaseUserEvent} from "../../user.base-event";
import {IRemoveUserPermissions} from "@sharedKernel";

export class UserPermissionsRemovedEvent extends BaseUserEvent<IRemoveUserPermissions> {}