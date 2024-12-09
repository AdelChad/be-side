import { IsString } from "class-validator";
import { Channel } from "src/channel/channel.entity";
import { User } from "src/user/user.entity";

export class MessageCreateDto {

    @IsString()
    author: User;

    @IsString()
    channel: Channel;

    @IsString()
    content: string;

}