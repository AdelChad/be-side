import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CategRestau } from './categ_restau.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { AssignTagDto } from './dto/assign-tag.dto';
import { Activities } from 'src/activities/activities.entity';
import { Restaurant } from 'src/restaurant/restaurant.entity';

@Injectable()
export class CategRestautService {
    constructor(
        @InjectRepository(CategRestau)
        public categRepository: Repository<CategRestau>,

        @InjectRepository(Restaurant)
        public restaurantRepository: Repository<Restaurant>,

    ) { }

    async getAllTags(): Promise<CategRestau[]> {
        return this.categRepository.find();
    }

    async createTag(createTagDto: CreateTagDto): Promise<CategRestau> {
        const { name } = createTagDto;

        let tags = new CategRestau();
        tags.name = name;
    
        return await this.categRepository.save(tags);
    }


    async updateTag(id: number, updateTagDto: UpdateTagDto): Promise<CategRestau | HttpException> {

        let tags = await this.categRepository.findOne({ where: { id: id } })

        if (tags) {
            const { name } = updateTagDto

            tags.name = name

            return await tags.save()
        } else {
            return new HttpException("L'action que vous essayez de modifier n'a peut etre pas le bon id ou l'id n'est peut etre pas bon ", HttpStatus.BAD_REQUEST)
        }
    }

    async assignTag(id: number, assignTagDto: AssignTagDto): Promise<Restaurant | HttpException> {

        let tagsArray: Array<CategRestau> = []
        let restaurant: Restaurant = await this.restaurantRepository.findOne({ where: { id: id } })

        if (restaurant) {
            const { tagArray } = assignTagDto

            for (let idTag of tagArray) {
                let tag: CategRestau = await this.categRepository.findOne({ where: { id: idTag } })
                tagsArray = [...tagsArray, tag]
            }
            restaurant.categRestau = tagsArray

            return await restaurant.save()
        } else {
            return new HttpException("L'action que vous essayez de modifier n'a peut etre pas le bon id ou l'id n'est peut etre pas bon ", HttpStatus.BAD_REQUEST)
        }
    }
}
