import {BaseDomainCommand} from "../../../domain/commands/impl/base-domain.command";
import {IUpdateUserLastName} from "@sharedKernel";

export class UpdateUserLastNameCommand extends BaseDomainCommand<IUpdateUserLastName> implements IUpdateUserLastName {
    constructor(
        public readonly aggregateRootId: string,
        public readonly lastName: string
    ) {
        super(aggregateRootId);
    }
}