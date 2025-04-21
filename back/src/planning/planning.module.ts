import { PlanningController } from './planning.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanningService } from './planning.service';
import { Module } from '@nestjs/common';
import { Planning } from './planning.entity';
import { Activities } from 'src/activities/activities.entity';
import { ActivityDay } from 'src/activity_day/activity-day.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Planning, ActivityDay, Activities])],
    controllers: [PlanningController],
    providers: [PlanningService],
    exports: [PlanningService],
})
export class PlanningModule { }
