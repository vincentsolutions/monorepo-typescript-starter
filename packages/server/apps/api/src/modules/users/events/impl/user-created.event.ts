import {BaseUserEvent} from "../../user.base-event";
import {ICreateUser} from "@sharedKernel";

export class UserCreatedEvent extends BaseUserEvent<ICreateUser> {}