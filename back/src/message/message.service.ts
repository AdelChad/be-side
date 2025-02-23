import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Message } from './message.entity';
import { MessageCreateDto } from './dto/message-create.dto';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(Message)
            public userRepository: Repository<Message>
        ){}

    async createMessage(messageCreateDto: MessageCreateDto, user: User): Promise<Message | undefined>{

        const { author, content, channel } = messageCreateDto

        let message = new Message()

        message.author = author
        message.channel = channel
        message.content = content;

        return await message.save();
    }

}
