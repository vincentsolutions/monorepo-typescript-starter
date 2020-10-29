import {BaseUserEvent} from "../../user.base-event";
import {IUpdateUserFirstName} from "@sharedKernel";

export class UserFirstNameUpdatedEvent extends BaseUserEvent<IUpdateUserFirstName> {}