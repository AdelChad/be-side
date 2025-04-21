import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1733308575252 implements MigrationInterface {
    name = 'Migration1733308575252'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`channel\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`groupeId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`message\` (\`id\` int NOT NULL AUTO_INCREMENT, \`content\` text NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`authorId\` int NULL, \`channelId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`groupe\` (\`id\` int NOT NULL AUTO_INCREMENT, \`groupeName\` text NOT NULL, \`creatorId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`groupe_members_user\` (\`groupeId\` int NOT NULL, \`userId\` int NOT NULL, INDEX \`IDX_aa403f99b58d3ecd050ae8e148\` (\`groupeId\`), INDEX \`IDX_a1a26ab9ec241188e487f5132f\` (\`userId\`), PRIMARY KEY (\`groupeId\`, \`userId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`channel\` ADD CONSTRAINT \`FK_08de6dc59eda20d2264246f2794\` FOREIGN KEY (\`groupeId\`) REFERENCES \`groupe\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_c72d82fa0e8699a141ed6cc41b3\` FOREIGN KEY (\`authorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_5fdbbcb32afcea663c2bea2954f\` FOREIGN KEY (\`channelId\`) REFERENCES \`channel\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`groupe\` ADD CONSTRAINT \`FK_1434289d7b019cb37b5c1b025c3\` FOREIGN KEY (\`creatorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`groupe_members_user\` ADD CONSTRAINT \`FK_aa403f99b58d3ecd050ae8e148f\` FOREIGN KEY (\`groupeId\`) REFERENCES \`groupe\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`groupe_members_user\` ADD CONSTRAINT \`FK_a1a26ab9ec241188e487f5132f7\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`groupe_members_user\` DROP FOREIGN KEY \`FK_a1a26ab9ec241188e487f5132f7\``);
        await queryRunner.query(`ALTER TABLE \`groupe_members_user\` DROP FOREIGN KEY \`FK_aa403f99b58d3ecd050ae8e148f\``);
        await queryRunner.query(`ALTER TABLE \`groupe\` DROP FOREIGN KEY \`FK_1434289d7b019cb37b5c1b025c3\``);
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_5fdbbcb32afcea663c2bea2954f\``);
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_c72d82fa0e8699a141ed6cc41b3\``);
        await queryRunner.query(`ALTER TABLE \`channel\` DROP FOREIGN KEY \`FK_08de6dc59eda20d2264246f2794\``);
        await queryRunner.query(`DROP INDEX \`IDX_a1a26ab9ec241188e487f5132f\` ON \`groupe_members_user\``);
        await queryRunner.query(`DROP INDEX \`IDX_aa403f99b58d3ecd050ae8e148\` ON \`groupe_members_user\``);
        await queryRunner.query(`DROP TABLE \`groupe_members_user\``);
        await queryRunner.query(`DROP TABLE \`groupe\``);
        await queryRunner.query(`DROP TABLE \`message\``);
        await queryRunner.query(`DROP TABLE \`channel\``);
    }

}
