import { PlanningController } from './planning.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanningService } from './planning.service';
import { Module } from '@nestjs/common';
import { Planning } from './planning.entity';
import { Activities } from 'src/activities/activities.entity';
import { ActivityDay } from 'src/activity_day/activity-day.entity';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { Groupe } from 'src/groupe/groupe.entity';
import { Restaurant } from 'src/restaurant/restaurant.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Planning, ActivityDay, Activities, Groupe, Restaurant]), UserModule],
    controllers: [PlanningController],
    providers: [PlanningService],
    exports: [PlanningService],
})
export class PlanningModule { }
