import {BaseDomainCommand} from "../../../domain/commands/impl/base-domain.command";

export interface IUpdateUserPhoneNumber {
    phoneNumber?: string;
}

export class UpdateUserPhoneNumberCommand extends BaseDomainCommand<IUpdateUserPhoneNumber> implements IUpdateUserPhoneNumber {
    constructor(
        public readonly aggregateRootId: string,
        public readonly phoneNumber?: string
    ) {
        super(aggregateRootId);
    }
}