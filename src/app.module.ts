import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { GroupeModule } from './groupe/groupe.module';
import { MessageModule } from './message/message.module';
require('dotenv').config();

@Module({
    imports: [ DatabaseModule, ConfigModule.forRoot({ isGlobal: true }), AuthModule, UserModule, GroupeModule, MessageModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }