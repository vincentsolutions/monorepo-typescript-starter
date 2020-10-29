import {BaseUserEvent} from "../../user.base-event";
import {IUpdateUserPassword} from "@sharedKernel";

export class UserPasswordUpdatedEvent extends BaseUserEvent<IUpdateUserPassword> {}