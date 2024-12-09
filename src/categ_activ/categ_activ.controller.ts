import { Controller, Get, Post, ParseIntPipe, Param, HttpException, UseGuards, Body, Put, Delete } from '@nestjs/common';
import { CategActiv } from './categ_activ.entity';
import { AuthGuard } from 'src/guard/auth.guard';
import { Roles } from 'src/decorators/role.decorator';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagsService } from './categ_activ.service';
import { UpdateTagDto } from './dto/update-tag.dto';
import { DeleteResult } from 'typeorm';
import { AssignTagDto } from './dto/assign-tag.dto';
import { Activities } from 'src/activities/activities.entity';

@Controller('tags')
export class TagsController {
    constructor(private tagsService: TagsService) { }

    @UseGuards(AuthGuard)
    @Roles(['user'])
    @Get()
    async getAllTags(): Promise<CategActiv[]> {
        return this.tagsService.getAllTags()
    }

    @UseGuards(AuthGuard)
    @Roles(['admin'])
    @Post()
    async createTag(@Body() createTagDto: CreateTagDto): Promise<CategActiv> {
        return await this.tagsService.createTag(createTagDto)
    }

    @UseGuards(AuthGuard)
    @Roles(['admin'])
    @Put(":id")
    async updateTag(@Param('id', ParseIntPipe) id: number, @Body() updateTagDto: UpdateTagDto): Promise<CategActiv | HttpException> {
        return this.tagsService.updateTag(id, updateTagDto);
    }

    @UseGuards(AuthGuard)
    @Roles(['admin'])
    @Put(":id/assign-tags")
    async assignActivitiesToTag(@Param('id', ParseIntPipe) id: number, @Body() assignTagDto: AssignTagDto): Promise<Activities | HttpException> {
        return this.tagsService.assignTag(id, assignTagDto);
    }

    @UseGuards(AuthGuard)
    @Roles(['admin'])
    @Delete(":id")
    async DeleteTag(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
        return await this.tagsService.tagsRepository.delete(id)
    }
}