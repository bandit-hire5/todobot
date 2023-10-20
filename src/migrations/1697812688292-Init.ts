import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1697812688292 implements MigrationInterface {
  name = "Init1697812688292";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "job_status_enum" AS ENUM('active', 'blocked')`);
    await queryRunner.query(
      `CREATE TABLE "job" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "version" integer NOT NULL DEFAULT 0, "status" "job_status_enum" NOT NULL, "uniqueHash" character varying NOT NULL, "scheduleOn" integer NOT NULL, "repeatInSeconds" integer NOT NULL DEFAULT 0, "data" text NOT NULL, CONSTRAINT "PK_98ab1c14ff8d1cf80d18703b92f" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c43e69367a6e8b887609330943" ON "job" ("uniqueHash") `);
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" integer NOT NULL DEFAULT 0, "updatedAt" integer NOT NULL DEFAULT 0, "deletedAt" integer NOT NULL DEFAULT 0, "deletedBy" character varying, "version" integer NOT NULL DEFAULT 0, "tgChatId" character varying NOT NULL, CONSTRAINT "UQ_602e07acbd21eb986679d254f25" UNIQUE ("tgChatId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_92f09bd6964a57bb87891a2acf" ON "user" ("deletedAt") `);
    await queryRunner.query(`CREATE TYPE "note_status_enum" AS ENUM('active', 'done')`);
    await queryRunner.query(
      `CREATE TABLE "note" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" integer NOT NULL DEFAULT 0, "updatedAt" integer NOT NULL DEFAULT 0, "deletedAt" integer NOT NULL DEFAULT 0, "deletedBy" character varying, "version" integer NOT NULL DEFAULT 0, "text" character varying NOT NULL, "status" "note_status_enum" NOT NULL, "userId" uuid, CONSTRAINT "PK_96d0c172a4fba276b1bbed43058" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_d93783f73db0300550481468df" ON "note" ("deletedAt") `);
    await queryRunner.query(
      `ALTER TABLE "note" ADD CONSTRAINT "FK_5b87d9d19127bd5d92026017a7b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "note" DROP CONSTRAINT "FK_5b87d9d19127bd5d92026017a7b"`);
    await queryRunner.query(`DROP INDEX "IDX_d93783f73db0300550481468df"`);
    await queryRunner.query(`DROP TABLE "note"`);
    await queryRunner.query(`DROP TYPE "note_status_enum"`);
    await queryRunner.query(`DROP INDEX "IDX_92f09bd6964a57bb87891a2acf"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP INDEX "IDX_c43e69367a6e8b887609330943"`);
    await queryRunner.query(`DROP TABLE "job"`);
    await queryRunner.query(`DROP TYPE "job_status_enum"`);
  }
}
