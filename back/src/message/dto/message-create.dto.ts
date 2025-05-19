import { IsNotEmpty, IsString } from "class-validator";
import { Channel } from "src/channel/channel.entity";
export class MessageCreateDto {

    @IsString()
    @IsNotEmpty()
    channel: Channel;

    @IsString()
    content: string;

}