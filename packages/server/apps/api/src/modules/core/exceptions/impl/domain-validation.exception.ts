import {BaseAggregateRoot} from "../../../domain/aggregate/base.aggregate-root";
import {Type} from "@nestjs/common";
import {BaseException} from "./base.exception";

export class DomainValidationException extends BaseException {
    public readonly type: string = 'DomainValidationException';
    public readonly message: string;

    public get aggregateName(): string { return this.aggregateType.name }

    constructor(
        message: string,
        public readonly aggregateType: Type<BaseAggregateRoot>
    ) {
        super(message);
        this.aggregateType = aggregateType;
    }


    getDetails() {
        return {
            ...super.getDetails(),
            type: this.type,
            aggregate: this.aggregateName
        };
    }
}