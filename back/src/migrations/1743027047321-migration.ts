import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1743027047321 implements MigrationInterface {
    name = 'Migration1743027047321'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`restaurant_favorits_user\` (\`restaurantId\` int NOT NULL, \`userId\` int NOT NULL, INDEX \`IDX_469da58b56b61b79d2bb8e5f2b\` (\`restaurantId\`), INDEX \`IDX_493c0dc8909e23ef48926f8c08\` (\`userId\`), PRIMARY KEY (\`restaurantId\`, \`userId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_groups_groupe\` (\`userId\` int NOT NULL, \`groupeId\` int NOT NULL, INDEX \`IDX_ad710771c891c4569b1ae102db\` (\`userId\`), INDEX \`IDX_67713a85d551bdd07b87679b21\` (\`groupeId\`), PRIMARY KEY (\`userId\`, \`groupeId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_favorits_activities_activities\` (\`userId\` int NOT NULL, \`activitiesId\` int NOT NULL, INDEX \`IDX_dfba2f9f9e56efeb0caf87c5e4\` (\`userId\`), INDEX \`IDX_271bc39b5cd2453d761ba651b9\` (\`activitiesId\`), PRIMARY KEY (\`userId\`, \`activitiesId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_favorits_restaurants_restaurant\` (\`userId\` int NOT NULL, \`restaurantId\` int NOT NULL, INDEX \`IDX_048554679721f7209eede9f4e0\` (\`userId\`), INDEX \`IDX_4c9bb9028dc7ab0d82a17feb3d\` (\`restaurantId\`), PRIMARY KEY (\`userId\`, \`restaurantId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`activities_favorits_user\` (\`activitiesId\` int NOT NULL, \`userId\` int NOT NULL, INDEX \`IDX_6b3d725824f114e58f2f123f57\` (\`activitiesId\`), INDEX \`IDX_73052029a160b3081872f99ca8\` (\`userId\`), PRIMARY KEY (\`activitiesId\`, \`userId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_c72d82fa0e8699a141ed6cc41b3\``);
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_5fdbbcb32afcea663c2bea2954f\``);
        await queryRunner.query(`ALTER TABLE \`message\` CHANGE \`authorId\` \`authorId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`message\` CHANGE \`channelId\` \`channelId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`channel\` DROP FOREIGN KEY \`FK_08de6dc59eda20d2264246f2794\``);
        await queryRunner.query(`ALTER TABLE \`channel\` CHANGE \`groupeId\` \`groupeId\` int NULL`);
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
        await queryRunner.query(`ALTER TABLE \`restaurant\` CHANGE \`latitude\` \`latitude\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`restaurant\` CHANGE \`longitude\` \`longitude\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`restaurant\` CHANGE \`googleId\` \`googleId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`activities\` CHANGE \`latitude\` \`latitude\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`activities\` CHANGE \`longitude\` \`longitude\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`activities\` CHANGE \`googleId\` \`googleId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_c72d82fa0e8699a141ed6cc41b3\` FOREIGN KEY (\`authorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_5fdbbcb32afcea663c2bea2954f\` FOREIGN KEY (\`channelId\`) REFERENCES \`channel\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`channel\` ADD CONSTRAINT \`FK_08de6dc59eda20d2264246f2794\` FOREIGN KEY (\`groupeId\`) REFERENCES \`groupe\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` ADD CONSTRAINT \`FK_b82068f99b428650e15bb8b0c37\` FOREIGN KEY (\`morningActivityId\`) REFERENCES \`activities\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` ADD CONSTRAINT \`FK_f3926ec4a605824d04fbe94b353\` FOREIGN KEY (\`noondayActivityId\`) REFERENCES \`activities\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` ADD CONSTRAINT \`FK_38323b4149ff3972183a1c3097f\` FOREIGN KEY (\`afternoonActivityId\`) REFERENCES \`activities\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` ADD CONSTRAINT \`FK_7af134c2f1935f328c5df8d1327\` FOREIGN KEY (\`eveningActivityId\`) REFERENCES \`activities\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` ADD CONSTRAINT \`FK_b722387cf8ed628c33bb9382157\` FOREIGN KEY (\`nightActivityId\`) REFERENCES \`activities\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`activity_day\` ADD CONSTRAINT \`FK_3f7ddff5eeca6b00af61daaa620\` FOREIGN KEY (\`planningId\`) REFERENCES \`planning\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`planning\` ADD CONSTRAINT \`FK_6039da80f469fd53adb05b8ba5c\` FOREIGN KEY (\`groupId\`) REFERENCES \`groupe\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`groupe\` ADD CONSTRAINT \`FK_1434289d7b019cb37b5c1b025c3\` FOREIGN KEY (\`creatorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`restaurant_favorits_user\` ADD CONSTRAINT \`FK_469da58b56b61b79d2bb8e5f2b0\` FOREIGN KEY (\`restaurantId\`) REFERENCES \`restaurant\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`restaurant_favorits_user\` ADD CONSTRAINT \`FK_493c0dc8909e23ef48926f8c08b\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_groups_groupe\` ADD CONSTRAINT \`FK_ad710771c891c4569b1ae102db7\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_groups_groupe\` ADD CONSTRAINT \`FK_67713a85d551bdd07b87679b211\` FOREIGN KEY (\`groupeId\`) REFERENCES \`groupe\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_favorits_activities_activities\` ADD CONSTRAINT \`FK_dfba2f9f9e56efeb0caf87c5e4c\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_favorits_activities_activities\` ADD CONSTRAINT \`FK_271bc39b5cd2453d761ba651b92\` FOREIGN KEY (\`activitiesId\`) REFERENCES \`activities\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_favorits_restaurants_restaurant\` ADD CONSTRAINT \`FK_048554679721f7209eede9f4e03\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_favorits_restaurants_restaurant\` ADD CONSTRAINT \`FK_4c9bb9028dc7ab0d82a17feb3d6\` FOREIGN KEY (\`restaurantId\`) REFERENCES \`restaurant\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`activities_favorits_user\` ADD CONSTRAINT \`FK_6b3d725824f114e58f2f123f572\` FOREIGN KEY (\`activitiesId\`) REFERENCES \`activities\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`activities_favorits_user\` ADD CONSTRAINT \`FK_73052029a160b3081872f99ca80\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`activities_favorits_user\` DROP FOREIGN KEY \`FK_73052029a160b3081872f99ca80\``);
        await queryRunner.query(`ALTER TABLE \`activities_favorits_user\` DROP FOREIGN KEY \`FK_6b3d725824f114e58f2f123f572\``);
        await queryRunner.query(`ALTER TABLE \`user_favorits_restaurants_restaurant\` DROP FOREIGN KEY \`FK_4c9bb9028dc7ab0d82a17feb3d6\``);
        await queryRunner.query(`ALTER TABLE \`user_favorits_restaurants_restaurant\` DROP FOREIGN KEY \`FK_048554679721f7209eede9f4e03\``);
        await queryRunner.query(`ALTER TABLE \`user_favorits_activities_activities\` DROP FOREIGN KEY \`FK_271bc39b5cd2453d761ba651b92\``);
        await queryRunner.query(`ALTER TABLE \`user_favorits_activities_activities\` DROP FOREIGN KEY \`FK_dfba2f9f9e56efeb0caf87c5e4c\``);
        await queryRunner.query(`ALTER TABLE \`user_groups_groupe\` DROP FOREIGN KEY \`FK_67713a85d551bdd07b87679b211\``);
        await queryRunner.query(`ALTER TABLE \`user_groups_groupe\` DROP FOREIGN KEY \`FK_ad710771c891c4569b1ae102db7\``);
        await queryRunner.query(`ALTER TABLE \`restaurant_favorits_user\` DROP FOREIGN KEY \`FK_493c0dc8909e23ef48926f8c08b\``);
        await queryRunner.query(`ALTER TABLE \`restaurant_favorits_user\` DROP FOREIGN KEY \`FK_469da58b56b61b79d2bb8e5f2b0\``);
        await queryRunner.query(`ALTER TABLE \`groupe\` DROP FOREIGN KEY \`FK_1434289d7b019cb37b5c1b025c3\``);
        await queryRunner.query(`ALTER TABLE \`planning\` DROP FOREIGN KEY \`FK_6039da80f469fd53adb05b8ba5c\``);
        await queryRunner.query(`ALTER TABLE \`activity_day\` DROP FOREIGN KEY \`FK_3f7ddff5eeca6b00af61daaa620\``);
        await queryRunner.query(`ALTER TABLE \`activity_day\` DROP FOREIGN KEY \`FK_b722387cf8ed628c33bb9382157\``);
        await queryRunner.query(`ALTER TABLE \`activity_day\` DROP FOREIGN KEY \`FK_7af134c2f1935f328c5df8d1327\``);
        await queryRunner.query(`ALTER TABLE \`activity_day\` DROP FOREIGN KEY \`FK_38323b4149ff3972183a1c3097f\``);
        await queryRunner.query(`ALTER TABLE \`activity_day\` DROP FOREIGN KEY \`FK_f3926ec4a605824d04fbe94b353\``);
        await queryRunner.query(`ALTER TABLE \`activity_day\` DROP FOREIGN KEY \`FK_b82068f99b428650e15bb8b0c37\``);
        await queryRunner.query(`ALTER TABLE \`channel\` DROP FOREIGN KEY \`FK_08de6dc59eda20d2264246f2794\``);
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_5fdbbcb32afcea663c2bea2954f\``);
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_c72d82fa0e8699a141ed6cc41b3\``);
        await queryRunner.query(`ALTER TABLE \`activities\` CHANGE \`googleId\` \`googleId\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`activities\` CHANGE \`longitude\` \`longitude\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`activities\` CHANGE \`latitude\` \`latitude\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`restaurant\` CHANGE \`googleId\` \`googleId\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`restaurant\` CHANGE \`longitude\` \`longitude\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`restaurant\` CHANGE \`latitude\` \`latitude\` varchar(255) NULL DEFAULT 'NULL'`);
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
        await queryRunner.query(`ALTER TABLE \`channel\` CHANGE \`groupeId\` \`groupeId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`channel\` ADD CONSTRAINT \`FK_08de6dc59eda20d2264246f2794\` FOREIGN KEY (\`groupeId\`) REFERENCES \`groupe\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`message\` CHANGE \`channelId\` \`channelId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`message\` CHANGE \`authorId\` \`authorId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_5fdbbcb32afcea663c2bea2954f\` FOREIGN KEY (\`channelId\`) REFERENCES \`channel\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_c72d82fa0e8699a141ed6cc41b3\` FOREIGN KEY (\`authorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP INDEX \`IDX_73052029a160b3081872f99ca8\` ON \`activities_favorits_user\``);
        await queryRunner.query(`DROP INDEX \`IDX_6b3d725824f114e58f2f123f57\` ON \`activities_favorits_user\``);
        await queryRunner.query(`DROP TABLE \`activities_favorits_user\``);
        await queryRunner.query(`DROP INDEX \`IDX_4c9bb9028dc7ab0d82a17feb3d\` ON \`user_favorits_restaurants_restaurant\``);
        await queryRunner.query(`DROP INDEX \`IDX_048554679721f7209eede9f4e0\` ON \`user_favorits_restaurants_restaurant\``);
        await queryRunner.query(`DROP TABLE \`user_favorits_restaurants_restaurant\``);
        await queryRunner.query(`DROP INDEX \`IDX_271bc39b5cd2453d761ba651b9\` ON \`user_favorits_activities_activities\``);
        await queryRunner.query(`DROP INDEX \`IDX_dfba2f9f9e56efeb0caf87c5e4\` ON \`user_favorits_activities_activities\``);
        await queryRunner.query(`DROP TABLE \`user_favorits_activities_activities\``);
        await queryRunner.query(`DROP INDEX \`IDX_67713a85d551bdd07b87679b21\` ON \`user_groups_groupe\``);
        await queryRunner.query(`DROP INDEX \`IDX_ad710771c891c4569b1ae102db\` ON \`user_groups_groupe\``);
        await queryRunner.query(`DROP TABLE \`user_groups_groupe\``);
        await queryRunner.query(`DROP INDEX \`IDX_493c0dc8909e23ef48926f8c08\` ON \`restaurant_favorits_user\``);
        await queryRunner.query(`DROP INDEX \`IDX_469da58b56b61b79d2bb8e5f2b\` ON \`restaurant_favorits_user\``);
        await queryRunner.query(`DROP TABLE \`restaurant_favorits_user\``);
    }

}
