import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1697802336192 implements MigrationInterface {
  name = "Init1697802336192";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `job` (`id` varchar(36) NOT NULL, `version` int NOT NULL DEFAULT 0, `status` enum ('active', 'blocked') NOT NULL, `uniqueHash` varchar(255) NOT NULL, `scheduleOn` int NOT NULL, `repeatInSeconds` int NOT NULL DEFAULT 0, `data` text NOT NULL, UNIQUE INDEX `IDX_c43e69367a6e8b887609330943` (`uniqueHash`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `user` (`id` varchar(36) NOT NULL, `createdAt` int NOT NULL DEFAULT 0, `updatedAt` int NOT NULL DEFAULT 0, `deletedAt` int NOT NULL DEFAULT 0, `deletedBy` varchar(255) NULL, `version` int NOT NULL DEFAULT 0, `tgChatId` varchar(255) NOT NULL, INDEX `IDX_92f09bd6964a57bb87891a2acf` (`deletedAt`), UNIQUE INDEX `IDX_602e07acbd21eb986679d254f2` (`tgChatId`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `note` (`id` varchar(36) NOT NULL, `createdAt` int NOT NULL DEFAULT 0, `updatedAt` int NOT NULL DEFAULT 0, `deletedAt` int NOT NULL DEFAULT 0, `deletedBy` varchar(255) NULL, `version` int NOT NULL DEFAULT 0, `text` varchar(255) NOT NULL, `status` enum ('active', 'done') NOT NULL, `userId` varchar(36) NULL, INDEX `IDX_d93783f73db0300550481468df` (`deletedAt`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "ALTER TABLE `note` ADD CONSTRAINT `FK_5b87d9d19127bd5d92026017a7b` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE `note` DROP FOREIGN KEY `FK_5b87d9d19127bd5d92026017a7b`");
    await queryRunner.query("DROP INDEX `IDX_d93783f73db0300550481468df` ON `note`");
    await queryRunner.query("DROP TABLE `note`");
    await queryRunner.query("DROP INDEX `IDX_602e07acbd21eb986679d254f2` ON `user`");
    await queryRunner.query("DROP INDEX `IDX_92f09bd6964a57bb87891a2acf` ON `user`");
    await queryRunner.query("DROP TABLE `user`");
    await queryRunner.query("DROP INDEX `IDX_c43e69367a6e8b887609330943` ON `job`");
    await queryRunner.query("DROP TABLE `job`");
  }
}
