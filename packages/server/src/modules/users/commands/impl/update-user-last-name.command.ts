import {BaseDomainCommand} from "../../../core/base/commands/impl/base-domain.command";

export interface IUpdateUserLastName {
    lastName: string;
}

export class UpdateUserLastNameCommand extends BaseDomainCommand<IUpdateUserLastName> implements IUpdateUserLastName {
    constructor(
        public readonly aggregateRootId: string,
        public readonly lastName: string
    ) {
        super(aggregateRootId);
    }
}