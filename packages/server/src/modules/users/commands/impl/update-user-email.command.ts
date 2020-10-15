import {BaseDomainCommand} from "../../../core/base/commands/impl/base-domain.command";

export interface IUpdateUserEmail {
    email: string;
}

export class UpdateUserEmailCommand extends BaseDomainCommand<IUpdateUserEmail> implements IUpdateUserEmail {
    constructor(
        public readonly aggregateRootId: string,
        public readonly email: string
    ) {
        super(aggregateRootId);
    }
}