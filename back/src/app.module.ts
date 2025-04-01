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
require('dotenv').config();

@Module({
  imports: [
    PlanningModule, DatabaseModule, ConfigModule.forRoot({ isGlobal: true }), ActivitiesModule, AuthModule, UserModule, CategModule, GoogleApiModule, ActivityDayModule, RestaurantsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }