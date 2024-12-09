import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Roles } from 'src/decorators/role.decorator';
import { AuthGuard } from 'src/guard/auth.guard';
import { UserRequest } from 'src/interface/user-request.interface';
import { UserService } from 'src/user/user.service';
import { Message } from './message.entity';
import { MessageCreateDto } from './dto/message-create.dto';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
    constructor(private messageService: MessageService, private userService: UserService) { }

    @UseGuards(AuthGuard)
    @Roles(['user'])
    @Post('create')
    async createMessage(@Body() messageCreateDto: MessageCreateDto, @Req() request): Promise<Message> {
        const userRequest: UserRequest = request.user
        const user = await this.userService.findOne(userRequest.email)

        return this.messageService.createMessage(messageCreateDto, user)
    }
}
