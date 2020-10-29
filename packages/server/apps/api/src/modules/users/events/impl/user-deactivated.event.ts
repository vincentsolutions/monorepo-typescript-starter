import {BaseUserEvent} from "../../user.base-event";
import {IDeactivateUser} from "@sharedKernel";

export class UserDeactivatedEvent extends BaseUserEvent<IDeactivateUser> {}