import {BaseDomainCommand} from "../../../domain/commands/impl/base-domain.command";
import {IUpdateUserEmail} from "@sharedKernel";

export class UpdateUserEmailCommand extends BaseDomainCommand<IUpdateUserEmail> implements IUpdateUserEmail {
    constructor(
        public readonly aggregateRootId: string,
        public readonly email: string
    ) {
        super(aggregateRootId);
    }
}