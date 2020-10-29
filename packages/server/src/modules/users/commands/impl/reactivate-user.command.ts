import {BaseDomainCommand} from "../../../domain/commands/impl/base-domain.command";
import {IReactivateUser} from "@sharedKernel";

export class ReactivateUserCommand extends BaseDomainCommand<IReactivateUser> implements IReactivateUser {
    constructor(
        public readonly aggregateRootId: string
    ) {
        super(aggregateRootId);
    }
}