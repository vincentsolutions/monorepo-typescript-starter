import {BaseDomainCommand} from "../../../domain/commands/impl/base-domain.command";
import {IDeactivateUser} from "@sharedKernel";

export class DeactivateUserCommand extends BaseDomainCommand<IDeactivateUser> implements IDeactivateUser {
    constructor(
        public readonly aggregateRootId: string
    ) {
        super(aggregateRootId);
    }
}