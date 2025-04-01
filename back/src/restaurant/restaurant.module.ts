import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './restaurant.entity';
import { Trigonometrie } from 'src/utils/trigonometrie';
import { CategActiv } from 'src/categ_activ/categ_activ.entity';
import { GoogleApiModule } from 'src/google-api/google-api.module';
import { PlanningModule } from 'src/planning/planning.module';
import { UserModule } from 'src/user/user.module';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { User } from 'src/user/user.entity';


@Module({
  imports: [GoogleApiModule, PlanningModule, UserModule, TypeOrmModule.forFeature([Restaurant, CategActiv, User])],
  controllers: [RestaurantController],
  providers: [RestaurantService, Trigonometrie],
  exports: [RestaurantService]
})
export class RestaurantsModule { }
