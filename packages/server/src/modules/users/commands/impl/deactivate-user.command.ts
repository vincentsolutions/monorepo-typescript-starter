import {BaseDomainCommand} from "../../../domain/commands/impl/base-domain.command";

export interface IDeactivateUser {

}

export class DeactivateUserCommand extends BaseDomainCommand<IDeactivateUser> implements IDeactivateUser {
    constructor(
        public readonly aggregateRootId: string
    ) {
        super(aggregateRootId);
    }
}