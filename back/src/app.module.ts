import { PlanningModule } from './planning/planning.module';
import { GoogleApiModule } from './google-api/google-api.module';
import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ActivitiesModule } from './activities/activities.module';
import { CategModule } from './categ_activ/categ_activ.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { ActivityDayModule } from './activity_day/acitivity-day.module';
import { RestaurantsModule } from './restaurant/restaurant.module';
import { CategRestauModule } from './categ_restau/categ_restau.module';
import { GroupeModule } from './groupe/groupe.module';
import { MessageModule } from './message/message.module';
require('dotenv').config();

@Module({
  imports: [
    PlanningModule, DatabaseModule, ActivitiesModule, AuthModule, UserModule, CategModule, CategRestauModule, GoogleApiModule, ActivityDayModule, RestaurantsModule, GroupeModule, MessageModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }