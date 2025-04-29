import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProfilePictureToUser1743174535301 implements MigrationInterface {
    name = 'AddProfilePictureToUser1743174535301'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`profilePicture\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`profilePicture\``);
    }

}
