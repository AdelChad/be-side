import { Controller, Get, Param, ParseIntPipe, Put, UseGuards } from '@nestjs/common';
import { PlanningService } from './planning.service';
import { Planning } from './planning.entity';
import { Roles } from 'src/decorators/role.decorator';
import { AuthGuard } from 'src/guard/auth.guard';

@Controller('plannings')
export class PlanningController {
    constructor(private readonly planningService: PlanningService) { }

    @Get()
    async getAllPlannings(): Promise<Planning[]> {
        return this.planningService.getAllPlannings();
    }

    @UseGuards(AuthGuard)
    @Roles(['user'])
    @Get(':id')
    async getPlanningById(@Param('id', ParseIntPipe) id: number): Promise<Planning> {
        return await this.planningService.getPlanningById(id);
    }

    @UseGuards(AuthGuard)
    @Roles(['user'])
    @Put(':id')
    async addActivityDay(@Param('id', ParseIntPipe) id: number): Promise<Planning> {
        return await this.planningService.addActivityDay(id)
    }
}
