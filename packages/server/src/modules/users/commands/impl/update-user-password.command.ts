import {BaseDomainCommand} from "../../../domain/commands/impl/base-domain.command";
import {IUpdateUserPassword} from "@sharedKernel";

export class UpdateUserPasswordCommand extends BaseDomainCommand<IUpdateUserPassword> implements IUpdateUserPassword {
    constructor(
        public readonly aggregateRootId: string,
        public readonly currentPassword: string,
        public readonly newPassword: string
    ) {
        super(aggregateRootId);
    }
}