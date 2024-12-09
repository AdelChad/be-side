import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CategActiv } from './categ_activ.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { AssignTagDto } from './dto/assign-tag.dto';
import { Activities } from 'src/activities/activities.entity';

@Injectable()
export class TagsService {
    constructor(
        @InjectRepository(CategActiv)
        public tagsRepository: Repository<CategActiv>,

        @InjectRepository(Activities)
        public activitiesRepository: Repository<Activities>,

    ) { }

    async getAllTags(): Promise<CategActiv[]> {
        return this.tagsRepository.find();
    }

    async createTag(createTagDto: CreateTagDto): Promise<CategActiv> {
        const { name } = createTagDto;

        let tags = new CategActiv();
        tags.name = name;
    
        return await this.tagsRepository.save(tags);
    }


    async updateTag(id: number, updateTagDto: UpdateTagDto): Promise<CategActiv | HttpException> {

        let tags = await this.tagsRepository.findOne({ where: { id: id } })

        if (tags) {
            const { name } = updateTagDto

            tags.name = name

            return await tags.save()
        } else {
            return new HttpException("L'action que vous essayez de modifier n'a peut etre pas le bon id ou l'id n'est peut etre pas bon ", HttpStatus.BAD_REQUEST)
        }
    }

    async assignTag(id: number, assignTagDto: AssignTagDto): Promise<Activities | HttpException> {

        let tagsArray: Array<CategActiv> = []
        let activity: Activities = await this.activitiesRepository.findOne({ where: { id: id } })

        if (activity) {
            const { tagArray } = assignTagDto

            for (let idTag of tagArray) {
                let tag: CategActiv = await this.tagsRepository.findOne({ where: { id: idTag } })
                tagsArray = [...tagsArray, tag]
            }
            activity.categActiv = tagsArray

            return await activity.save()
        } else {
            return new HttpException("L'action que vous essayez de modifier n'a peut etre pas le bon id ou l'id n'est peut etre pas bon ", HttpStatus.BAD_REQUEST)
        }
    }
}
