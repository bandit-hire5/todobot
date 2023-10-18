import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1697635007580 implements MigrationInterface {
  name = "Init1697635007580";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" integer NOT NULL DEFAULT (0), "updatedAt" integer NOT NULL DEFAULT (0), "deletedAt" integer NOT NULL DEFAULT (0), "deletedBy" varchar, "version" integer NOT NULL DEFAULT (0), "tgChatId" varchar NOT NULL, CONSTRAINT "UQ_602e07acbd21eb986679d254f25" UNIQUE ("tgChatId"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_92f09bd6964a57bb87891a2acf" ON "user" ("deletedAt") `);
    await queryRunner.query(
      `CREATE TABLE "note" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" integer NOT NULL DEFAULT (0), "updatedAt" integer NOT NULL DEFAULT (0), "deletedAt" integer NOT NULL DEFAULT (0), "deletedBy" varchar, "version" integer NOT NULL DEFAULT (0), "text" varchar NOT NULL, "status" varchar NOT NULL, "userId" varchar)`
    );
    await queryRunner.query(`CREATE INDEX "IDX_d93783f73db0300550481468df" ON "note" ("deletedAt") `);
    await queryRunner.query(`DROP INDEX "IDX_d93783f73db0300550481468df"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_note" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" integer NOT NULL DEFAULT (0), "updatedAt" integer NOT NULL DEFAULT (0), "deletedAt" integer NOT NULL DEFAULT (0), "deletedBy" varchar, "version" integer NOT NULL DEFAULT (0), "text" varchar NOT NULL, "status" varchar NOT NULL, "userId" varchar, CONSTRAINT "FK_5b87d9d19127bd5d92026017a7b" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_note"("id", "createdAt", "updatedAt", "deletedAt", "deletedBy", "version", "text", "status", "userId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "deletedBy", "version", "text", "status", "userId" FROM "note"`
    );
    await queryRunner.query(`DROP TABLE "note"`);
    await queryRunner.query(`ALTER TABLE "temporary_note" RENAME TO "note"`);
    await queryRunner.query(`CREATE INDEX "IDX_d93783f73db0300550481468df" ON "note" ("deletedAt") `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_d93783f73db0300550481468df"`);
    await queryRunner.query(`ALTER TABLE "note" RENAME TO "temporary_note"`);
    await queryRunner.query(
      `CREATE TABLE "note" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" integer NOT NULL DEFAULT (0), "updatedAt" integer NOT NULL DEFAULT (0), "deletedAt" integer NOT NULL DEFAULT (0), "deletedBy" varchar, "version" integer NOT NULL DEFAULT (0), "text" varchar NOT NULL, "status" varchar NOT NULL, "userId" varchar)`
    );
    await queryRunner.query(
      `INSERT INTO "note"("id", "createdAt", "updatedAt", "deletedAt", "deletedBy", "version", "text", "status", "userId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "deletedBy", "version", "text", "status", "userId" FROM "temporary_note"`
    );
    await queryRunner.query(`DROP TABLE "temporary_note"`);
    await queryRunner.query(`CREATE INDEX "IDX_d93783f73db0300550481468df" ON "note" ("deletedAt") `);
    await queryRunner.query(`DROP INDEX "IDX_d93783f73db0300550481468df"`);
    await queryRunner.query(`DROP TABLE "note"`);
    await queryRunner.query(`DROP INDEX "IDX_92f09bd6964a57bb87891a2acf"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
