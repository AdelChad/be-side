import { Module } from '@nestjs/common';
import { ActivityDayController } from './activity-day.controller';
import { ActivityDayService } from './activity-day.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityDay } from './activity-day.entity';
import { Activities } from 'src/activities/activities.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ActivityDay, Activities])],
    controllers: [ActivityDayController],
    providers: [ActivityDayService],
    exports: [ActivityDayService]
})
export class ActivityDayModule { }
