import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1747838662552 implements MigrationInterface {
    name = 'Migration1747838662552'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`activity_day\` DROP FOREIGN KEY \`FK_3f7ddff5eeca6b00af61daaa620\``);
        await queryRunner.query(`CREATE TABLE \`planning_activities_activities\` (\`planningId\` int NOT NULL, \`activitiesId\` int NOT NULL, INDEX \`IDX_be4e6a7fa2f008ac8df7f116ad\` (\`planningId\`), INDEX \`IDX_9f1ab6d3d2e070429f27b64c0f\` (\`activitiesId\`), PRIMARY KEY (\`planningId\`, \`activitiesId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`activities_plannings_planning\` (\`activitiesId\` int NOT NULL, \`planningId\` int NOT NULL, INDEX \`IDX_95bdb08004f4370bae22617530\` (\`activitiesId\`), INDEX \`IDX_96705dd1f98750d68231eb1d49\` (\`planningId\`), PRIMARY KEY (\`activitiesId\`, \`planningId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` DROP COLUMN \`planningId\``);
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_c72d82fa0e8699a141ed6cc41b3\``);
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_5fdbbcb32afcea663c2bea2954f\``);
        await queryRunner.query(`ALTER TABLE \`message\` CHANGE \`authorId\` \`authorId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`message\` CHANGE \`channelId\` \`channelId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`channel\` DROP FOREIGN KEY \`FK_08de6dc59eda20d2264246f2794\``);
        await queryRunner.query(`ALTER TABLE \`channel\` CHANGE \`groupeId\` \`groupeId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`planning\` DROP FOREIGN KEY \`FK_6039da80f469fd53adb05b8ba5c\``);
        await queryRunner.query(`ALTER TABLE \`planning\` CHANGE \`name\` \`name\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`planning\` CHANGE \`groupId\` \`groupId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`groupe\` DROP FOREIGN KEY \`FK_1434289d7b019cb37b5c1b025c3\``);
        await queryRunner.query(`ALTER TABLE \`groupe\` CHANGE \`creatorId\` \`creatorId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`restaurant\` CHANGE \`latitude\` \`latitude\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`restaurant\` CHANGE \`longitude\` \`longitude\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`restaurant\` CHANGE \`googleId\` \`googleId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`dateJoined\` \`dateJoined\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`profilePicture\` \`profilePicture\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`activities\` CHANGE \`latitude\` \`latitude\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`activities\` CHANGE \`longitude\` \`longitude\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`activities\` CHANGE \`googleId\` \`googleId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` DROP FOREIGN KEY \`FK_b82068f99b428650e15bb8b0c37\``);
        await queryRunner.query(`ALTER TABLE \`activity_day\` DROP FOREIGN KEY \`FK_f3926ec4a605824d04fbe94b353\``);
        await queryRunner.query(`ALTER TABLE \`activity_day\` DROP FOREIGN KEY \`FK_38323b4149ff3972183a1c3097f\``);
        await queryRunner.query(`ALTER TABLE \`activity_day\` DROP FOREIGN KEY \`FK_7af134c2f1935f328c5df8d1327\``);
        await queryRunner.query(`ALTER TABLE \`activity_day\` DROP FOREIGN KEY \`FK_b722387cf8ed628c33bb9382157\``);
        await queryRunner.query(`ALTER TABLE \`activity_day\` CHANGE \`morningActivityId\` \`morningActivityId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` CHANGE \`noondayActivityId\` \`noondayActivityId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` CHANGE \`afternoonActivityId\` \`afternoonActivityId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` CHANGE \`eveningActivityId\` \`eveningActivityId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` CHANGE \`nightActivityId\` \`nightActivityId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_c72d82fa0e8699a141ed6cc41b3\` FOREIGN KEY (\`authorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_5fdbbcb32afcea663c2bea2954f\` FOREIGN KEY (\`channelId\`) REFERENCES \`channel\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`channel\` ADD CONSTRAINT \`FK_08de6dc59eda20d2264246f2794\` FOREIGN KEY (\`groupeId\`) REFERENCES \`groupe\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`planning\` ADD CONSTRAINT \`FK_6039da80f469fd53adb05b8ba5c\` FOREIGN KEY (\`groupId\`) REFERENCES \`groupe\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`groupe\` ADD CONSTRAINT \`FK_1434289d7b019cb37b5c1b025c3\` FOREIGN KEY (\`creatorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` ADD CONSTRAINT \`FK_b82068f99b428650e15bb8b0c37\` FOREIGN KEY (\`morningActivityId\`) REFERENCES \`activities\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` ADD CONSTRAINT \`FK_f3926ec4a605824d04fbe94b353\` FOREIGN KEY (\`noondayActivityId\`) REFERENCES \`activities\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` ADD CONSTRAINT \`FK_38323b4149ff3972183a1c3097f\` FOREIGN KEY (\`afternoonActivityId\`) REFERENCES \`activities\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` ADD CONSTRAINT \`FK_7af134c2f1935f328c5df8d1327\` FOREIGN KEY (\`eveningActivityId\`) REFERENCES \`activities\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` ADD CONSTRAINT \`FK_b722387cf8ed628c33bb9382157\` FOREIGN KEY (\`nightActivityId\`) REFERENCES \`activities\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`planning_activities_activities\` ADD CONSTRAINT \`FK_be4e6a7fa2f008ac8df7f116ade\` FOREIGN KEY (\`planningId\`) REFERENCES \`planning\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`planning_activities_activities\` ADD CONSTRAINT \`FK_9f1ab6d3d2e070429f27b64c0fe\` FOREIGN KEY (\`activitiesId\`) REFERENCES \`activities\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`activities_plannings_planning\` ADD CONSTRAINT \`FK_95bdb08004f4370bae226175300\` FOREIGN KEY (\`activitiesId\`) REFERENCES \`activities\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`activities_plannings_planning\` ADD CONSTRAINT \`FK_96705dd1f98750d68231eb1d497\` FOREIGN KEY (\`planningId\`) REFERENCES \`planning\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`activities_plannings_planning\` DROP FOREIGN KEY \`FK_96705dd1f98750d68231eb1d497\``);
        await queryRunner.query(`ALTER TABLE \`activities_plannings_planning\` DROP FOREIGN KEY \`FK_95bdb08004f4370bae226175300\``);
        await queryRunner.query(`ALTER TABLE \`planning_activities_activities\` DROP FOREIGN KEY \`FK_9f1ab6d3d2e070429f27b64c0fe\``);
        await queryRunner.query(`ALTER TABLE \`planning_activities_activities\` DROP FOREIGN KEY \`FK_be4e6a7fa2f008ac8df7f116ade\``);
        await queryRunner.query(`ALTER TABLE \`activity_day\` DROP FOREIGN KEY \`FK_b722387cf8ed628c33bb9382157\``);
        await queryRunner.query(`ALTER TABLE \`activity_day\` DROP FOREIGN KEY \`FK_7af134c2f1935f328c5df8d1327\``);
        await queryRunner.query(`ALTER TABLE \`activity_day\` DROP FOREIGN KEY \`FK_38323b4149ff3972183a1c3097f\``);
        await queryRunner.query(`ALTER TABLE \`activity_day\` DROP FOREIGN KEY \`FK_f3926ec4a605824d04fbe94b353\``);
        await queryRunner.query(`ALTER TABLE \`activity_day\` DROP FOREIGN KEY \`FK_b82068f99b428650e15bb8b0c37\``);
        await queryRunner.query(`ALTER TABLE \`groupe\` DROP FOREIGN KEY \`FK_1434289d7b019cb37b5c1b025c3\``);
        await queryRunner.query(`ALTER TABLE \`planning\` DROP FOREIGN KEY \`FK_6039da80f469fd53adb05b8ba5c\``);
        await queryRunner.query(`ALTER TABLE \`channel\` DROP FOREIGN KEY \`FK_08de6dc59eda20d2264246f2794\``);
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_5fdbbcb32afcea663c2bea2954f\``);
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_c72d82fa0e8699a141ed6cc41b3\``);
        await queryRunner.query(`ALTER TABLE \`activity_day\` CHANGE \`nightActivityId\` \`nightActivityId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` CHANGE \`eveningActivityId\` \`eveningActivityId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` CHANGE \`afternoonActivityId\` \`afternoonActivityId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` CHANGE \`noondayActivityId\` \`noondayActivityId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` CHANGE \`morningActivityId\` \`morningActivityId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` ADD CONSTRAINT \`FK_b722387cf8ed628c33bb9382157\` FOREIGN KEY (\`nightActivityId\`) REFERENCES \`activities\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` ADD CONSTRAINT \`FK_7af134c2f1935f328c5df8d1327\` FOREIGN KEY (\`eveningActivityId\`) REFERENCES \`activities\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` ADD CONSTRAINT \`FK_38323b4149ff3972183a1c3097f\` FOREIGN KEY (\`afternoonActivityId\`) REFERENCES \`activities\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` ADD CONSTRAINT \`FK_f3926ec4a605824d04fbe94b353\` FOREIGN KEY (\`noondayActivityId\`) REFERENCES \`activities\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` ADD CONSTRAINT \`FK_b82068f99b428650e15bb8b0c37\` FOREIGN KEY (\`morningActivityId\`) REFERENCES \`activities\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`activities\` CHANGE \`googleId\` \`googleId\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`activities\` CHANGE \`longitude\` \`longitude\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`activities\` CHANGE \`latitude\` \`latitude\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`profilePicture\` \`profilePicture\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`dateJoined\` \`dateJoined\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`restaurant\` CHANGE \`googleId\` \`googleId\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`restaurant\` CHANGE \`longitude\` \`longitude\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`restaurant\` CHANGE \`latitude\` \`latitude\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`groupe\` CHANGE \`creatorId\` \`creatorId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`groupe\` ADD CONSTRAINT \`FK_1434289d7b019cb37b5c1b025c3\` FOREIGN KEY (\`creatorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`planning\` CHANGE \`groupId\` \`groupId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`planning\` CHANGE \`name\` \`name\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`planning\` ADD CONSTRAINT \`FK_6039da80f469fd53adb05b8ba5c\` FOREIGN KEY (\`groupId\`) REFERENCES \`groupe\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`channel\` CHANGE \`groupeId\` \`groupeId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`channel\` ADD CONSTRAINT \`FK_08de6dc59eda20d2264246f2794\` FOREIGN KEY (\`groupeId\`) REFERENCES \`groupe\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`message\` CHANGE \`channelId\` \`channelId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`message\` CHANGE \`authorId\` \`authorId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_5fdbbcb32afcea663c2bea2954f\` FOREIGN KEY (\`channelId\`) REFERENCES \`channel\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_c72d82fa0e8699a141ed6cc41b3\` FOREIGN KEY (\`authorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` ADD \`planningId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`DROP INDEX \`IDX_96705dd1f98750d68231eb1d49\` ON \`activities_plannings_planning\``);
        await queryRunner.query(`DROP INDEX \`IDX_95bdb08004f4370bae22617530\` ON \`activities_plannings_planning\``);
        await queryRunner.query(`DROP TABLE \`activities_plannings_planning\``);
        await queryRunner.query(`DROP INDEX \`IDX_9f1ab6d3d2e070429f27b64c0f\` ON \`planning_activities_activities\``);
        await queryRunner.query(`DROP INDEX \`IDX_be4e6a7fa2f008ac8df7f116ad\` ON \`planning_activities_activities\``);
        await queryRunner.query(`DROP TABLE \`planning_activities_activities\``);
        await queryRunner.query(`ALTER TABLE \`activity_day\` ADD CONSTRAINT \`FK_3f7ddff5eeca6b00af61daaa620\` FOREIGN KEY (\`planningId\`) REFERENCES \`planning\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
