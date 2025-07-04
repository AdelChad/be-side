import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { Trigonometrie } from 'src/utils/trigonometrie';
import { CategRestau } from 'src/categ_restau/categ_restau.entity';
import { PlanningService } from 'src/planning/planning.service';
import { User } from 'src/user/user.entity';
import { FilterRestaurantsDto } from './dto/filter-restaurants.dto';

@Injectable()
export class RestaurantService {
    constructor(
        @InjectRepository(Restaurant)
        public restaurantRepository: Repository<Restaurant>,

        @InjectRepository(CategRestau)
        public categRestauRepository: Repository<CategRestau>,

        public trigonometrie: Trigonometrie,

    ) { }

    async getAllRestaurant(): Promise<Restaurant[]> {
        return this.restaurantRepository.find({
            relations: ['categRestau', 'favorits'],
            order: { name: 'ASC' },
        });
    }

    async restaurantsByCateg(categsName: Array<string>): Promise<Array<Restaurant>> {
        let arrayRestaurant: Array<Restaurant> = []
    
        for (let categ of categsName) {
            let restaurants: Array<Restaurant> = await this.restaurantRepository.find({ 
                relations: { categRestau: true }, 
                where: [
                    { categRestau: { name: categ }}, 
                ] 
            })

            if(restaurants){
                for (let restaurant of restaurants) {
                    arrayRestaurant = [...arrayRestaurant, restaurant]
                }
            }else{
                throw new HttpException("Aucun restaurant a été trouvée", HttpStatus.BAD_REQUEST)
            }
        }

        return arrayRestaurant;
    }

    async RestaurantsMainCity(): Promise<Array<Restaurant>> {
        try {
            let restaurants: Array<Restaurant> = []
    
            restaurants = await this.restaurantRepository.find({
                where: {
                    city: Like(`%Paris%`)
                },
                order: {
                    rating: 'DESC',
                },
                take: 20,
            });
    
            return restaurants;
    
        } catch (error) {
            console.error('Error fetching restaurants:', error);
        }
    }
}
