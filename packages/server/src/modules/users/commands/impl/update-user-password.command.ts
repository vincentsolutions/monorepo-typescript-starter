import {BaseDomainCommand} from "../../../core/base/commands/impl/base-domain.command";

export interface IUpdateUserPassword {
    currentPassword: string;
    newPassword: string;
}

export class UpdateUserPasswordCommand extends BaseDomainCommand<IUpdateUserPassword> implements IUpdateUserPassword {
    constructor(
        public readonly aggregateRootId: string,
        public readonly currentPassword: string,
        public readonly newPassword: string
    ) {
        super(aggregateRootId);
    }
}