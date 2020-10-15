import {Column, Entity, Index} from "typeorm/index";
import {BaseDomainEntity} from "../core/base/entities/base-domain-entity";
import {Permission} from "./models/Permission";

@Entity({ name: "user" })
export class User extends BaseDomainEntity {
    id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Index()
    @Column()
    email: string;

    @Column({ nullable: true })
    phoneNumber: string;

    @Column({ default: true })
    isActive: boolean;

    @Column()
    password: string;

    @Column("jsonb", { default: [] })
    permissions: Permission[];
}