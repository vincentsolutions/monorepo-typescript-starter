import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedRefreshTokenEntity1603661185918 implements MigrationInterface {
    name = 'AddedRefreshTokenEntity1603661185918'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "refresh_tokens" ("id" SERIAL NOT NULL, "userId" uuid NOT NULL, "refreshToken" text NOT NULL, "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_610102b60fea1455310ccd299d" ON "refresh_tokens" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_84519890ff1135ab93aba6546f" ON "refresh_tokens" ("refreshToken") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_84519890ff1135ab93aba6546f"`);
        await queryRunner.query(`DROP INDEX "IDX_610102b60fea1455310ccd299d"`);
        await queryRunner.query(`DROP TABLE "refresh_tokens"`);
    }

}
