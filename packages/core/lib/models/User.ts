import {BaseModel, IBaseModelDto, IBaseModelInput} from "../internal";
import {computed, observable, reaction} from "mobx";

export interface IUserInput extends IBaseModelInput {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    permissions: Permission[];
}

export interface IUserDto extends IBaseModelDto {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    permissions: Permission[];
}

export class User extends BaseModel<IUserInput, IUserDto> implements IUserDto {
    @observable public firstName: string;
    @observable public lastName: string;
    @observable public email: string;
    @observable public phoneNumber?: string;
    @observable public readonly permissions: Permission[];

    protected constructor(input: IUserInput, id?: string) {
        super(input, id);

        this.firstName = input.firstName;
        this.lastName = input.lastName;
        this.email = input.email;
        this.phoneNumber = input.phoneNumber;
        this.permissions = input.permissions;

        reaction(
            () => [ this.firstName, this.lastName, this.email, this.phoneNumber, ...this.permissions ],
            () => this.updateUpdatedAt()
        );
    }

    @computed get displayName(): string { return `${this.firstName} ${this.lastName}` };
    @computed get isAdmin(): boolean { return this.permissions.includes(Permission.Admin) }

    public static createNew(input: IUserInput) {
        return new this(input);
    }

    public static createFromDto(dto: IUserDto) {
        const model = new this({
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email,
            phoneNumber: dto.phoneNumber,
            permissions: dto.permissions
        }, dto.id);

        model.updateFromDto(dto);

        return model;
    }
}

export enum Permission {
    Default,
    Admin
}