import {BaseUserEvent} from "../../user.base-event";
import {IUpdateUserLastName} from "@sharedKernel";

export class UserLastNameUpdatedEvent extends BaseUserEvent<IUpdateUserLastName> {}