import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageController } from './message.controller';
import { Message } from './message.entity';
import { MessageService } from './message.service';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Message, User])],
  controllers: [MessageController],
  providers: [MessageService, UserService],
  exports: [MessageService]
})

export class MessageModule {}