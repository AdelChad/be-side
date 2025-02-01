import { Controller, Get, Post, ParseIntPipe, Param, HttpException, UseGuards, Body, Put, Delete } from '@nestjs/common';
import { CategRestau } from './categ_restau.entity';
import { AuthGuard } from 'src/guard/auth.guard';
import { Roles } from 'src/decorators/role.decorator';
import { CreateTagDto } from './dto/create-tag.dto';
import { CategRestautService } from './categ_restau.service';
import { UpdateTagDto } from './dto/update-tag.dto';
import { DeleteResult } from 'typeorm';
import { AssignTagDto } from './dto/assign-tag.dto';
import { Restaurant } from 'src/restaurant/restaurant.entity';

@Controller('categ-restau')
export class CategRestauController {
    constructor(private categRestauService: CategRestautService) { }

    @UseGuards(AuthGuard)
    @Roles(['user'])
    @Get()
    async getAllTags(): Promise<CategRestau[]> {
        return this.categRestauService.getAllTags()
    }

    @UseGuards(AuthGuard)
    @Roles(['admin'])
    @Post()
    async createTag(@Body() createTagDto: CreateTagDto): Promise<CategRestau> {
        return await this.categRestauService.createTag(createTagDto)
    }

    @UseGuards(AuthGuard)
    @Roles(['admin'])
    @Put(":id")
    async updateTag(@Param('id', ParseIntPipe) id: number, @Body() updateTagDto: UpdateTagDto): Promise<CategRestau  | HttpException> {
        return this.categRestauService.updateTag(id, updateTagDto);
    }

    @UseGuards(AuthGuard)
    @Roles(['admin'])
    @Put(":id/assign-tags")
    async assignActivitiesToTag(@Param('id', ParseIntPipe) id: number, @Body() assignTagDto: AssignTagDto): Promise<Restaurant | HttpException> {
        return this.categRestauService.assignTag(id, assignTagDto);
    }

    @UseGuards(AuthGuard)
    @Roles(['admin'])
    @Delete(":id")
    async DeleteTag(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
        return await this.categRestauService.categRepository.delete(id)
    }
}