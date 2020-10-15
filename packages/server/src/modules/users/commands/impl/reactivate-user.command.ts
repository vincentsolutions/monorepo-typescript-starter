import {BaseDomainCommand} from "../../../core/base/commands/impl/base-domain.command";

export interface IReactivateUser {

}

export class ReactivateUserCommand extends BaseDomainCommand<IReactivateUser> implements IReactivateUser {
    constructor(
        public readonly aggregateRootId: string
    ) {
        super(aggregateRootId);
    }
}