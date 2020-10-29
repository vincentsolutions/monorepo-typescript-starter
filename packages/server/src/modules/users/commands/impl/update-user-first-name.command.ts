import {BaseDomainCommand} from "../../../domain/commands/impl/base-domain.command";
import {IUpdateUserFirstName} from "@sharedKernel";

export class UpdateUserFirstNameCommand extends BaseDomainCommand<IUpdateUserFirstName> implements IUpdateUserFirstName {
    constructor(
        public readonly aggregateRootId: string,
        public readonly firstName: string
    ) {
        super(aggregateRootId);
    }
}