import {action, makeObservable, observable} from "mobx";
import { v4 } from 'uuid';

export interface IBaseModelInput {

}

export interface IBaseModelDto {
    readonly id: string;
    createdAt: string;
    updatedAt?: string;
}

export class BaseModel<TInput extends IBaseModelInput = IBaseModelInput, TDto extends IBaseModelDto = IBaseModelDto> implements IBaseModelDto {
    @observable public readonly id: string;
    @observable public createdAt: string;
    @observable public updatedAt?: string;

    @action protected updateUpdatedAt() {
        this.updatedAt = new Date().toISOString();
    }

    protected constructor(input?: TInput, id: string = v4()) {
        makeObservable(this);

        this.id = id;
        this.createdAt = new Date().toISOString();
    }

    protected updateFromDto(dto: TDto) {
        this.createdAt = dto.createdAt;
        this.updatedAt = dto.updatedAt;
    }

    public static createNew(input: IBaseModelInput) {
        return new this(input);
    }

    public static createFromDto(dto: IBaseModelDto) {
        const model = new this({}, dto.id);
        model.createdAt = dto.createdAt;
        model.updatedAt = dto.updatedAt;

        return model;
    }
}