import {BaseUserEvent} from "../../user.base-event";
import {IReactivateUser} from "@sharedKernel";

export class UserReactivatedEvent extends BaseUserEvent<IReactivateUser> {}