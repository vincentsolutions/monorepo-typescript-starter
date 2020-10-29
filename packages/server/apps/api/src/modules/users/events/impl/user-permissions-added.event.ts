import {BaseUserEvent} from "../../user.base-event";
import {IAddUserPermissions} from "@sharedKernel";

export class UserPermissionsAddedEvent extends BaseUserEvent<IAddUserPermissions> {}