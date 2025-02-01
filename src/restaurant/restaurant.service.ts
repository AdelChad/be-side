import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { Trigonometrie } from 'src/utils/trigonometrie';
import { GoogleApiService } from 'src/google-api/google-api.service';
import { CategRestau } from 'src/categ_restau/categ_restau.entity';
import { PlanningService } from 'src/planning/planning.service';
import { User } from 'src/user/user.entity';
import { GenerateRestaurantsPos } from './dto/generate-restaurants-pos.dto';
import { GeocodeAddresse } from 'src/interface/geocodeAddresse';

@Injectable()
export class RestaurantService {
    constructor(
        @InjectRepository(Restaurant)
        public restaurantRepository: Repository<Restaurant>,

        @InjectRepository(CategRestau)
        public categRestauRepository: Repository<CategRestau>,

        public trigonometrie: Trigonometrie,
        private googleApi: GoogleApiService,
        private planningService: PlanningService

    ) { }

    async getAllRestaurant(): Promise<Restaurant[]> {
        return this.restaurantRepository.find()
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

    async RestaurantsBySearch(searchRestaurantsPos: GenerateRestaurantsPos, user: User): Promise<Array<Restaurant>> {
        try {
            const { search, city, latitude, longitude } = searchRestaurantsPos;
            let array: Array<Restaurant> = []
            let restaurants: Array<Restaurant> = []
            let geocodeAddress: GeocodeAddresse
            const cityRecovered = isEmptyString(city) ? user.city : city
    
            restaurants = await this.restaurantRepository.find({
                where: {
                    name: Like(`%${search}%`)
                }
            });

            geocodeAddress = !isEmptyString(latitude) || !isEmptyString(longitude) ? { lat: latitude,long: longitude} : await this.googleApi.getAddresseGeocode(cityRecovered);
    
            for (const restaurant of restaurants) {
                if (this.trigonometrie.distance(geocodeAddress, restaurant)) {
                    array.push(restaurant);
                }
            }
    
            return array;
    
        } catch (error) {
            console.error('Error fetching restaurants:', error);
        }
    }
}
