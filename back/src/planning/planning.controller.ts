import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { PlanningService } from './planning.service';
import { Planning } from './planning.entity';
import { Roles } from 'src/decorators/role.decorator';
import { AuthGuard } from 'src/guard/auth.guard';
import { UserRequest } from 'src/interface/user-request.interface';
import { UserService } from 'src/user/user.service';
import { PlanningCreateDto } from './dto/create-planning.dto';
import { PlanningUpdateDto } from './dto/modify-planning.dto';
import { PlanningShareDto } from './dto/share-planning.dto';
import { DeleteActivityDto } from './dto/delete-activity.dto';

@Controller('plannings')
export class PlanningController {
    constructor(
        private readonly planningService: PlanningService,
        private userService: UserService
    ) { }

    @UseGuards(AuthGuard)
    @Roles(['user'])
    @Get()
    async getAllPlanningsUser(@Req() request): Promise<Planning[]> {
        const userRequest: UserRequest = request.user
        const user = await this.userService.findOne(userRequest.email)

        return this.planningService.getAllPlannings(user);
    }

    @UseGuards(AuthGuard)
    @Roles(['user'])
    @Post('create')
    async createPlanning(@Body() activitiesCreateDto: PlanningCreateDto, @Req() request): Promise<Planning> {
        const userRequest: UserRequest = request.user
        const user = await this.userService.findOne(userRequest.email)

        return await this.planningService.createPlanning(activitiesCreateDto, user)
    }

    @UseGuards(AuthGuard)
    @Roles(['user'])
    @Post('update')
    async modifyPlanning(@Body() activitiesCreateDto: PlanningUpdateDto, @Req() request): Promise<Planning> {
        const userRequest: UserRequest = request.user
        const user = await this.userService.findOne(userRequest.email)

        return await this.planningService.modifyActivityDay(activitiesCreateDto, user)
    }

    @UseGuards(AuthGuard)
    @Roles(['user'])
    @Post('delete_activity')
    async deleteActivity(@Body() dto: DeleteActivityDto, @Req() request): Promise<any> {
        const userRequest: UserRequest = request.user
        const user = await this.userService.findOne(userRequest.email)

        return await this.planningService.removeActivityFromDay(dto, user);
    }


    @UseGuards(AuthGuard)
    @Roles(['user'])
    @Get(':id')
    async getPlanningById(@Param('id') id: string, @Req() request): Promise<Planning> {
        const userRequest: UserRequest = request.user
        const user = await this.userService.findOne(userRequest.email)

        return await this.planningService.getPlanningById(+id, user);
    }

    @UseGuards(AuthGuard)
    @Roles(['user'])
    @Post('share')
    async sharePlanning(@Body() activitiesShareDto: PlanningShareDto, @Req() request): Promise<Planning> {
        const userRequest: UserRequest = request.user
        const user = await this.userService.findOne(userRequest.email)

        return await this.planningService.sharePlanning(activitiesShareDto, user);
    }
}
