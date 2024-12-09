import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1733241848982 implements MigrationInterface {
    name = 'Migration1733241848982'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`dateJoined\` datetime NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`role\` enum ('user', 'admin') NOT NULL DEFAULT 'user'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`role\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`dateJoined\``);
    }

}
