import {MigrationInterface, QueryRunner} from "typeorm";

export class AddJobs1697637776270 implements MigrationInterface {
    name = 'AddJobs1697637776270'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "job" ("id" varchar PRIMARY KEY NOT NULL, "version" integer NOT NULL DEFAULT (0), "status" varchar NOT NULL, "uniqueHash" varchar NOT NULL, "scheduleOn" integer NOT NULL, "repeatInSeconds" integer NOT NULL DEFAULT (0), "data" text NOT NULL)`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c43e69367a6e8b887609330943" ON "job" ("uniqueHash") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_c43e69367a6e8b887609330943"`);
        await queryRunner.query(`DROP TABLE "job"`);
    }

}
