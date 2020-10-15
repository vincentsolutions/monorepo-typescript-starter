import {AggregateRoot} from "@nestjs/cqrs";

export abstract class BaseAggregateRoot extends AggregateRoot {

    protected constructor(
        params: Record<string, any>
    ) {
        super();
        this.initFromParams(params);
    }

    protected initFromParams(params: Record<string, any>) {
        const keysToExclude: string[] = [
            'id',
            'aggregateRootId'
        ];

        for (const key of Object.keys(params)) {
            if (Object.getOwnPropertyNames(this).includes(key) && !keysToExclude.includes(key)) {
                this[key] = params[key];
            }
        }
    }
}