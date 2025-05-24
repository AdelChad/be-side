import { Module } from '@nestjs/common';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activities } from './activities.entity';
import { Trigonometrie } from 'src/utils/trigonometrie';
import { CategActiv } from 'src/categ_activ/categ_activ.entity';
import { GoogleApiModule } from 'src/google-api/google-api.module';
import { PlanningModule } from 'src/planning/planning.module';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/user.entity';
import { Planning } from 'src/planning/planning.entity';


@Module({
  imports: [GoogleApiModule, PlanningModule, UserModule, TypeOrmModule.forFeature([Activities, CategActiv, User, Planning])],
  controllers: [ActivitiesController],
  providers: [ActivitiesService, Trigonometrie],
  exports: [ActivitiesService]
})
export class ActivitiesModule { }
