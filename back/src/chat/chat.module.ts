import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { Message } from "src/message/message.entity";
import { ChatService } from "./chat.service";
import { ChatGateway } from "./chat.gateway";
import { User } from "src/user/user.entity";
import { Channel } from "src/channel/channel.entity";
import { Planning } from "src/planning/planning.entity";
import { ActivityDay } from "src/activity_day/activity-day.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Message, Channel, Planning, ActivityDay, User]),
        forwardRef(() => AuthModule),
    ],
    providers: [ChatGateway, ChatService],
    exports: [ChatService],
})
export class ChatModule {}