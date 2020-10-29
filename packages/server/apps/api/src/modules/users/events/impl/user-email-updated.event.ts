import {BaseUserEvent} from "../../user.base-event";
import {IUpdateUserEmail} from "@sharedKernel";

export class UserEmailUpdatedEvent extends BaseUserEvent<IUpdateUserEmail> {}