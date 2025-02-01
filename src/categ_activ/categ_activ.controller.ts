import { Controller, Get, Post, ParseIntPipe, Param, HttpException, UseGuards, Body, Put, Delete } from '@nestjs/common';
import { CategActiv } from './categ_activ.entity';
import { AuthGuard } from 'src/guard/auth.guard';
import { Roles } from 'src/decorators/role.decorator';
import { CreateTagDto } from './dto/create-tag.dto';
import { CategService } from './categ_activ.service';
import { UpdateTagDto } from './dto/update-tag.dto';
import { DeleteResult } from 'typeorm';
import { AssignTagDto } from './dto/assign-tag.dto';
import { Activities } from 'src/activities/activities.entity';

@Controller('categ-activ')
export class CategController {
    constructor(private categService: CategService) { }

    @UseGuards(AuthGuard)
    @Roles(['user'])
    @Get()
    async getAllTags(): Promise<CategActiv[]> {
        return this.categService.getAllTags()
    }

    @UseGuards(AuthGuard)
    @Roles(['admin'])
    @Post()
    async createTag(@Body() createTagDto: CreateTagDto): Promise<CategActiv> {
        return await this.categService.createTag(createTagDto)
    }

    @UseGuards(AuthGuard)
    @Roles(['admin'])
    @Put(":id")
    async updateTag(@Param('id', ParseIntPipe) id: number, @Body() updateTagDto: UpdateTagDto): Promise<CategActiv  | HttpException> {
        return this.categService.updateTag(id, updateTagDto);
    }

    @UseGuards(AuthGuard)
    @Roles(['admin'])
    @Put(":id/assign-tags")
    async assignActivitiesToTag(@Param('id', ParseIntPipe) id: number, @Body() assignTagDto: AssignTagDto): Promise<Activities | HttpException> {
        return this.categService.assignTag(id, assignTagDto);
    }

    @UseGuards(AuthGuard)
    @Roles(['admin'])
    @Delete(":id")
    async DeleteTag(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
        return await this.categService.categRepository.delete(id)
    }
}