import { Body, Controller, Delete, Get, Param, ParseIntPipe, Put, UseGuards } from '@nestjs/common';
import { ActivityDayService } from './activity-day.service';
import { UpdateActivityDto } from './dto/update-activityDay';
import { Roles } from 'src/decorators/role.decorator';
import { AuthGuard } from 'src/guard/auth.guard';
import { DeleteResult } from 'typeorm';
import { ActivityDay } from './activity-day.entity';

@Controller('activity-day')
export class ActivityDayController {
    constructor(private activityDayService: ActivityDayService) { }


    @Get()
    generatedActivities() {
        return this.activityDayService.getActivitiesOfTheDay()
    }

    @UseGuards(AuthGuard)
    @Roles(['user'])
    @Put(':id')
    addActivity(@Param('id', ParseIntPipe) id: number, @Body() updateActivityDto: UpdateActivityDto): Promise<ActivityDay> {
        return this.activityDayService.addActivityInDay(id, updateActivityDto)
    }

    @UseGuards(AuthGuard)
    @Roles(['user'])
    @Delete('id')
    async deleteActivityDay(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
        return this.activityDayService.activityDayRepository.delete({ id: id })
    }

}