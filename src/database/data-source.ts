import { ConfigService } from "@nestjs/config";
import { Groupe } from "src/groupe/groupe.entity";
import { Channel } from "src/channel/channel.entity";
import { Message } from "src/message/message.entity";
import { User } from 'src/user/user.entity';
import { DataSource } from 'typeorm';
require('dotenv').config();

const configService = new ConfigService();

const dataSource = new DataSource({
    type: "mysql",
    host: configService.getOrThrow('DB_HOST'),
    username: configService.getOrThrow('DB_USERNAME'),
    password: configService.getOrThrow('DB_PASSWORD'),
    database: configService.getOrThrow('DB_NAME'),
    entities: [User, Groupe, Channel, Message],
    migrations: ["dist/migrations/**/*.js"],
    synchronize: false,
    logging: true,
});

export default dataSource;
