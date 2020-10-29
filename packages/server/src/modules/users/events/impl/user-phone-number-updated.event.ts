import {BaseUserEvent} from "../../user.base-event";
import {IUpdateUserPhoneNumber} from "@sharedKernel";

export class UserPhoneNumberUpdatedEvent extends BaseUserEvent<IUpdateUserPhoneNumber> {}