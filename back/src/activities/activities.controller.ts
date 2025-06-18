import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { Activities } from './activities.entity';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activities.dto';
import { FilterActivitiesDto } from './dto/filter-activities.dto';
import { Roles } from 'src/decorators/role.decorator';
import { AuthGuard } from 'src/guard/auth.guard';
import { UserRequest } from 'src/interface/user-request.interface';
import { UserService } from 'src/user/user.service';

@Controller('activities')
export class ActivitiesController {
    constructor(private activitiesService: ActivitiesService, private userService: UserService) { }

    @UseGuards(AuthGuard)
    @Roles(['user'])
    @Get()
    async getAllActivities(): Promise<Activities[]> {
        return this.activitiesService.getAllActivities()
    }

    @UseGuards(AuthGuard)
    @Roles(['user'])
    @Get("by-categ")
    async activitiesByCateg(@Query('categActiv') query: string): Promise<Array<Activities> | HttpException> {
        let categActivName = query.split(',')
        return this.activitiesService.activitiesByCateg(categActivName);
    }

    @Get("carrousel")
    async activitiesForCarrousel(@Req() request): Promise<Array<Activities> | HttpException> {
        return this.activitiesService.activitiesMainCity();
    }

    @UseGuards(AuthGuard)
    @Roles(['user'])
    @Get(":id")
    async findOneActivities(@Param('id', ParseIntPipe) id: number): Promise<Activities | HttpException> {
        let activities = await this.activitiesService.activitiesRepository.findOne({ where: { id: id }, relations: { categActiv: true } })

        if (activities) {
            return activities
        } else {
            return new HttpException("L'id de l'activité n'existe pas ou n'est peut etre pas le bon", HttpStatus.BAD_REQUEST)
        }
    }

    @UseGuards(AuthGuard)
    @Roles(['admin'])
    @Post()
    async createActivities(@Body() createActivityDto: CreateActivityDto): Promise<Activities> {
        return await this.activitiesService.createActivities(createActivityDto)
    }

    @UseGuards(AuthGuard)
    @Roles(['admin'])
    @Put(":id")
    async updateActivity(@Param('id', ParseIntPipe) id: number, @Body() updateActivityDto: UpdateActivityDto): Promise<Activities | HttpException> {
        return this.activitiesService.updateActivity(id, updateActivityDto);
    }

    @UseGuards(AuthGuard)
    @Roles(['admin'])
    @Delete(":id")
    async DeleteActivity(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
        return await this.activitiesService.activitiesRepository.delete(id)
    }
}
