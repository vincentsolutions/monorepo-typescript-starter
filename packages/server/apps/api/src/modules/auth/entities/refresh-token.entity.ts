import {Column, Entity, Index, PrimaryGeneratedColumn} from "typeorm/index";
import {BaseEntity} from "../../core/base/entities/base-entity";


@Entity("refresh_tokens")
export class RefreshToken extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Index()
    @Column("uuid")
    userId: string;

    @Index()
    @Column("text")
    refreshToken: string;

    @Column("timestamp")
    expiresAt: string;

    constructor(userId: string, refreshToken: string, expiresAt: string) {
        super();

        this.userId = userId;
        this.refreshToken = refreshToken;
        this.expiresAt = expiresAt;
    }
}