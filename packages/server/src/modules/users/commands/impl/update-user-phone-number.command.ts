import {BaseDomainCommand} from "../../../domain/commands/impl/base-domain.command";
import {IUpdateUserPhoneNumber} from "@sharedKernel";

export class UpdateUserPhoneNumberCommand extends BaseDomainCommand<IUpdateUserPhoneNumber> implements IUpdateUserPhoneNumber {
    constructor(
        public readonly aggregateRootId: string,
        public readonly phoneNumber?: string
    ) {
        super(aggregateRootId);
    }
}