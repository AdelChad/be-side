import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { Vote } from 'src/vote/vote.entity';
import { Clash } from './clash.entity';
import { ClashService } from './clash.service';
import { ClashController } from './clash.controller';
import { User } from 'src/user/user.entity';
import { Channel } from 'src/channel/channel.entity';
import { Activities } from 'src/activities/activities.entity';
import { Restaurant } from 'src/restaurant/restaurant.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Vote, Clash, Channel, Activities, Restaurant, User]), UserModule],
    controllers: [ClashController],
    providers: [ClashService],
    exports: [ClashService],
})
export class ClashModule { }
