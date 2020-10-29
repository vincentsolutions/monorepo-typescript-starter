import {BaseCommand} from "./base.command";

export abstract class BaseDomainCommand<TInterface extends {} = any> extends BaseCommand {
    protected constructor(
        public readonly aggregateRootId: string
    ) {
        super();
    }

    toObject(): TInterface {
        const properties = Object.getOwnPropertyNames(this);

        const returnObject: Partial<TInterface> = {};

        for (const prop of properties) {
            if (prop === 'aggregateRootId') {
                continue;
            }

            returnObject[prop] = this[prop];
        }

        return returnObject as TInterface;
    }
}