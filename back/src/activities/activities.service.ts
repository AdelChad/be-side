import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Activities } from './activities.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activities.dto';
import { Trigonometrie } from 'src/utils/trigonometrie';
import { GoogleApiService } from 'src/google-api/google-api.service';
import { CategActiv } from 'src/categ_activ/categ_activ.entity';
import { PlanningService } from 'src/planning/planning.service';
import { User } from 'src/user/user.entity';
import { GenerateActivitiesPos } from './dto/generate-activities-pos.dto';
import { GeocodeAddresse } from 'src/interface/geocodeAddresse';


@Injectable()
export class ActivitiesService {
    constructor(
        @InjectRepository(Activities)
        public activitiesRepository: Repository<Activities>,

        @InjectRepository(CategActiv)
        public categActivRepository: Repository<CategActiv>,

        public trigonometrie: Trigonometrie,
        private googleApi: GoogleApiService,
        private planningService: PlanningService

    ) { }

    async getAllActivities(): Promise<Activities[]> {
        return this.activitiesRepository.find()
    }

    async createActivities(createActivitiesDto: CreateActivityDto): Promise<Activities> {
        const { name, country, address, price, description, city, isBook } = createActivitiesDto

        let activities = new Activities()

        activities.name = name;
        activities.country = country;
        activities.address = address;
        activities.price = price;
        activities.description = description;
        activities.city = city;
        activities.isBook = isBook;


        return await activities.save()

    }

    async updateActivity(id: number, updateActivityDto: UpdateActivityDto): Promise<Activities> {

        let activities = await this.activitiesRepository.findOne({ where: { id: id } })

        if (activities) {
            const { name, address } = updateActivityDto

            activities.name = name
            activities.address = address
            return await activities.save()
        } else {
            throw new HttpException("L'action que vous essayez de modifier n'a peut etre pas le bon id ou l'id n'est peut etre pas bon ", HttpStatus.BAD_REQUEST)
        }
    }


    async activitiesByCateg(categsName: Array<string>): Promise<Array<Activities>> {
        let arrayActivities: Array<Activities> = []
    
        for (let categ of categsName) {
            let activities: Array<Activities> = await this.activitiesRepository.find({ 
                relations: { categActiv: true }, 
                where: [
                    { categActiv: { name: categ }}, 
                ] 
            })

            if(activities){
                for (let activity of activities) {
                    arrayActivities = [...arrayActivities, activity]
                }
            }else{
                throw new HttpException("Aucune activité a été trouvée", HttpStatus.BAD_REQUEST)
            }
        }

        return arrayActivities;
    }

    async activitiesBySearch(searchActivitiesPos: GenerateActivitiesPos, user: User): Promise<Array<Activities>> {
        try {
            const { search, city, latitude, longitude } = searchActivitiesPos;
            let array: Array<Activities> = []
            let activities: Array<Activities> = []
            let geocodeAddress: GeocodeAddresse
            const cityRecovered = isEmptyString(city) ? user.city : city
    
            activities = await this.activitiesRepository.find({
                where: {
                    name: Like(`%${search}%`)
                }
            });

            geocodeAddress = !isEmptyString(latitude) || !isEmptyString(longitude) ? { lat: latitude,long: longitude} : await this.googleApi.getAddresseGeocode(cityRecovered);
    
            for (const activity of activities) {
                if (this.trigonometrie.distance(geocodeAddress, activity)) {
                    array.push(activity);
                }
            }
    
            return array;
    
        } catch (error) {
            console.error('Error fetching activities:', error);
        }
    }

    async activitiesMainCity(user: User): Promise<Array<Activities>> {
        try {
            let activities: Array<Activities> = []
    
            activities = await this.activitiesRepository.find({
                where: {
                    city: Like(`%${user.city}%`)
                },
                order: {
                    rating: 'DESC',
                },
                take: 20,
            });
    
            return activities;
    
        } catch (error) {
            console.error('Error fetching activities:', error);
        }
    }
}
