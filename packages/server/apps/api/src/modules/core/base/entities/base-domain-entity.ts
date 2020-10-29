import {PrimaryColumn} from "typeorm/index";

export class BaseDomainEntity {
    @PrimaryColumn()
    id: string;
}