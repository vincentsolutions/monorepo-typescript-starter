import {MigrationInterface, QueryRunner} from "typeorm";

export class snapshots1602987624544 implements MigrationInterface {
    name = 'snapshots1602987624544'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "aggregate_snapshot" ("aggregateRootId" character varying NOT NULL, "version" integer NOT NULL, "aggregateSnapshot" jsonb NOT NULL, CONSTRAINT "PK_05b10f37759e68b336a240f3562" PRIMARY KEY ("aggregateRootId"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "aggregate_snapshot"`);
    }

}
