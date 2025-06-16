import { ConfigService } from "@nestjs/config";
import { Activities } from "src/activities/activities.entity";
import { ActivityDay } from "src/activity_day/activity-day.entity";
import { CategActiv } from "src/categ_activ/categ_activ.entity";
import { CategRestau } from "src/categ_restau/categ_restau.entity";
import { Channel } from "src/channel/channel.entity";
import { Clash } from "src/clash/clash.entity";
import { Groupe } from "src/groupe/groupe.entity";
import { Message } from "src/message/message.entity";
import { Planning } from "src/planning/planning.entity";
import { Restaurant } from "src/restaurant/restaurant.entity";
import { User } from "src/user/user.entity";
import { Vote } from "src/vote/vote.entity";
import { DataSource } from "typeorm";
require('dotenv').config();


const configService = new ConfigService();


const dataSource = new DataSource({
    type: "mysql",
    host: configService.getOrThrow('DB_HOST'),
    username: configService.getOrThrow('DB_USERNAME'),
    password: configService.getOrThrow('DB_PASSWORD'),
    database: configService.getOrThrow('DB_NAME'),
    entities: [ActivityDay, Activities, User, Planning, CategActiv, Groupe, Message, Channel, Restaurant, CategRestau, Clash, Vote],
    migrations: ["dist/migrations/**/*.js"],
    synchronize: false,
    logging: false
})

export default dataSource