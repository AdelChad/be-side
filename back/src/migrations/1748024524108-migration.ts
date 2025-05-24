import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1748024524108 implements MigrationInterface {
    name = 'Migration1748024524108'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`activity_day\` ADD \`breakfastRestaurantId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` ADD \`lunchRestaurantId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` ADD \`dinnerRestaurantId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_c72d82fa0e8699a141ed6cc41b3\``);
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_5fdbbcb32afcea663c2bea2954f\``);
        await queryRunner.query(`ALTER TABLE \`message\` CHANGE \`authorId\` \`authorId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`message\` CHANGE \`channelId\` \`channelId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`channel\` DROP FOREIGN KEY \`FK_08de6dc59eda20d2264246f2794\``);
        await queryRunner.query(`ALTER TABLE \`channel\` CHANGE \`groupeId\` \`groupeId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`restaurant\` CHANGE \`latitude\` \`latitude\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`restaurant\` CHANGE \`longitude\` \`longitude\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`restaurant\` CHANGE \`googleId\` \`googleId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` DROP FOREIGN KEY \`FK_b82068f99b428650e15bb8b0c37\``);
        await queryRunner.query(`ALTER TABLE \`activity_day\` DROP FOREIGN KEY \`FK_f3926ec4a605824d04fbe94b353\``);
        await queryRunner.query(`ALTER TABLE \`activity_day\` DROP FOREIGN KEY \`FK_38323b4149ff3972183a1c3097f\``);
        await queryRunner.query(`ALTER TABLE \`activity_day\` DROP FOREIGN KEY \`FK_7af134c2f1935f328c5df8d1327\``);
        await queryRunner.query(`ALTER TABLE \`activity_day\` DROP FOREIGN KEY \`FK_b722387cf8ed628c33bb9382157\``);
        await queryRunner.query(`ALTER TABLE \`activity_day\` DROP FOREIGN KEY \`FK_3f7ddff5eeca6b00af61daaa620\``);
        await queryRunner.query(`ALTER TABLE \`activity_day\` CHANGE \`morningActivityId\` \`morningActivityId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` CHANGE \`noondayActivityId\` \`noondayActivityId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` CHANGE \`afternoonActivityId\` \`afternoonActivityId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` CHANGE \`eveningActivityId\` \`eveningActivityId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` CHANGE \`nightActivityId\` \`nightActivityId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` CHANGE \`planningId\` \`planningId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`planning\` DROP FOREIGN KEY \`FK_6039da80f469fd53adb05b8ba5c\``);
        await queryRunner.query(`ALTER TABLE \`planning\` CHANGE \`name\` \`name\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`planning\` CHANGE \`groupId\` \`groupId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`groupe\` DROP FOREIGN KEY \`FK_1434289d7b019cb37b5c1b025c3\``);
        await queryRunner.query(`ALTER TABLE \`groupe\` CHANGE \`creatorId\` \`creatorId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`dateJoined\` \`dateJoined\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`profilePicture\` \`profilePicture\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`activities\` CHANGE \`latitude\` \`latitude\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`activities\` CHANGE \`longitude\` \`longitude\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`activities\` CHANGE \`googleId\` \`googleId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_c72d82fa0e8699a141ed6cc41b3\` FOREIGN KEY (\`authorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_5fdbbcb32afcea663c2bea2954f\` FOREIGN KEY (\`channelId\`) REFERENCES \`channel\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`channel\` ADD CONSTRAINT \`FK_08de6dc59eda20d2264246f2794\` FOREIGN KEY (\`groupeId\`) REFERENCES \`groupe\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` ADD CONSTRAINT \`FK_101eb08b82df7a36f761123d23a\` FOREIGN KEY (\`breakfastRestaurantId\`) REFERENCES \`restaurant\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` ADD CONSTRAINT \`FK_b82068f99b428650e15bb8b0c37\` FOREIGN KEY (\`morningActivityId\`) REFERENCES \`activities\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` ADD CONSTRAINT \`FK_f3926ec4a605824d04fbe94b353\` FOREIGN KEY (\`noondayActivityId\`) REFERENCES \`activities\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` ADD CONSTRAINT \`FK_0ad248e219d3934a3933b2e531a\` FOREIGN KEY (\`lunchRestaurantId\`) REFERENCES \`restaurant\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` ADD CONSTRAINT \`FK_38323b4149ff3972183a1c3097f\` FOREIGN KEY (\`afternoonActivityId\`) REFERENCES \`activities\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` ADD CONSTRAINT \`FK_7af134c2f1935f328c5df8d1327\` FOREIGN KEY (\`eveningActivityId\`) REFERENCES \`activities\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` ADD CONSTRAINT \`FK_3407b0fc103835c6eada1cd46e3\` FOREIGN KEY (\`dinnerRestaurantId\`) REFERENCES \`restaurant\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` ADD CONSTRAINT \`FK_b722387cf8ed628c33bb9382157\` FOREIGN KEY (\`nightActivityId\`) REFERENCES \`activities\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` ADD CONSTRAINT \`FK_3f7ddff5eeca6b00af61daaa620\` FOREIGN KEY (\`planningId\`) REFERENCES \`planning\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`planning\` ADD CONSTRAINT \`FK_6039da80f469fd53adb05b8ba5c\` FOREIGN KEY (\`groupId\`) REFERENCES \`groupe\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`groupe\` ADD CONSTRAINT \`FK_1434289d7b019cb37b5c1b025c3\` FOREIGN KEY (\`creatorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`groupe\` DROP FOREIGN KEY \`FK_1434289d7b019cb37b5c1b025c3\``);
        await queryRunner.query(`ALTER TABLE \`planning\` DROP FOREIGN KEY \`FK_6039da80f469fd53adb05b8ba5c\``);
        await queryRunner.query(`ALTER TABLE \`activity_day\` DROP FOREIGN KEY \`FK_3f7ddff5eeca6b00af61daaa620\``);
        await queryRunner.query(`ALTER TABLE \`activity_day\` DROP FOREIGN KEY \`FK_b722387cf8ed628c33bb9382157\``);
        await queryRunner.query(`ALTER TABLE \`activity_day\` DROP FOREIGN KEY \`FK_3407b0fc103835c6eada1cd46e3\``);
        await queryRunner.query(`ALTER TABLE \`activity_day\` DROP FOREIGN KEY \`FK_7af134c2f1935f328c5df8d1327\``);
        await queryRunner.query(`ALTER TABLE \`activity_day\` DROP FOREIGN KEY \`FK_38323b4149ff3972183a1c3097f\``);
        await queryRunner.query(`ALTER TABLE \`activity_day\` DROP FOREIGN KEY \`FK_0ad248e219d3934a3933b2e531a\``);
        await queryRunner.query(`ALTER TABLE \`activity_day\` DROP FOREIGN KEY \`FK_f3926ec4a605824d04fbe94b353\``);
        await queryRunner.query(`ALTER TABLE \`activity_day\` DROP FOREIGN KEY \`FK_b82068f99b428650e15bb8b0c37\``);
        await queryRunner.query(`ALTER TABLE \`activity_day\` DROP FOREIGN KEY \`FK_101eb08b82df7a36f761123d23a\``);
        await queryRunner.query(`ALTER TABLE \`channel\` DROP FOREIGN KEY \`FK_08de6dc59eda20d2264246f2794\``);
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_5fdbbcb32afcea663c2bea2954f\``);
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_c72d82fa0e8699a141ed6cc41b3\``);
        await queryRunner.query(`ALTER TABLE \`activities\` CHANGE \`googleId\` \`googleId\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`activities\` CHANGE \`longitude\` \`longitude\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`activities\` CHANGE \`latitude\` \`latitude\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`profilePicture\` \`profilePicture\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`dateJoined\` \`dateJoined\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`groupe\` CHANGE \`creatorId\` \`creatorId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`groupe\` ADD CONSTRAINT \`FK_1434289d7b019cb37b5c1b025c3\` FOREIGN KEY (\`creatorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`planning\` CHANGE \`groupId\` \`groupId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`planning\` CHANGE \`name\` \`name\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`planning\` ADD CONSTRAINT \`FK_6039da80f469fd53adb05b8ba5c\` FOREIGN KEY (\`groupId\`) REFERENCES \`groupe\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` CHANGE \`planningId\` \`planningId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` CHANGE \`nightActivityId\` \`nightActivityId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` CHANGE \`eveningActivityId\` \`eveningActivityId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` CHANGE \`afternoonActivityId\` \`afternoonActivityId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` CHANGE \`noondayActivityId\` \`noondayActivityId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` CHANGE \`morningActivityId\` \`morningActivityId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` ADD CONSTRAINT \`FK_3f7ddff5eeca6b00af61daaa620\` FOREIGN KEY (\`planningId\`) REFERENCES \`planning\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` ADD CONSTRAINT \`FK_b722387cf8ed628c33bb9382157\` FOREIGN KEY (\`nightActivityId\`) REFERENCES \`activities\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` ADD CONSTRAINT \`FK_7af134c2f1935f328c5df8d1327\` FOREIGN KEY (\`eveningActivityId\`) REFERENCES \`activities\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` ADD CONSTRAINT \`FK_38323b4149ff3972183a1c3097f\` FOREIGN KEY (\`afternoonActivityId\`) REFERENCES \`activities\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` ADD CONSTRAINT \`FK_f3926ec4a605824d04fbe94b353\` FOREIGN KEY (\`noondayActivityId\`) REFERENCES \`activities\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` ADD CONSTRAINT \`FK_b82068f99b428650e15bb8b0c37\` FOREIGN KEY (\`morningActivityId\`) REFERENCES \`activities\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`restaurant\` CHANGE \`googleId\` \`googleId\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`restaurant\` CHANGE \`longitude\` \`longitude\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`restaurant\` CHANGE \`latitude\` \`latitude\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`channel\` CHANGE \`groupeId\` \`groupeId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`channel\` ADD CONSTRAINT \`FK_08de6dc59eda20d2264246f2794\` FOREIGN KEY (\`groupeId\`) REFERENCES \`groupe\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`message\` CHANGE \`channelId\` \`channelId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`message\` CHANGE \`authorId\` \`authorId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_5fdbbcb32afcea663c2bea2954f\` FOREIGN KEY (\`channelId\`) REFERENCES \`channel\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_c72d82fa0e8699a141ed6cc41b3\` FOREIGN KEY (\`authorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` DROP COLUMN \`dinnerRestaurantId\``);
        await queryRunner.query(`ALTER TABLE \`activity_day\` DROP COLUMN \`lunchRestaurantId\``);
        await queryRunner.query(`ALTER TABLE \`activity_day\` DROP COLUMN \`breakfastRestaurantId\``);
    }

}
