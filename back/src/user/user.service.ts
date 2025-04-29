import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt'
import { UserCreateDto } from './dto/create-user.dto';
import { Activities } from 'src/activities/activities.entity';
import { Restaurant } from 'src/restaurant/restaurant.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,

        @InjectRepository(Activities)
        public activitiesRepository: Repository<Activities>,

        @InjectRepository(Activities)
        public restaurantsRepository: Repository<Restaurant>,
    ) {}

    findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    findOne(email: string): Promise<User> {
        return this.userRepository.findOneBy({ email });
    }

    async create(createUserDto: UserCreateDto) {
        const { firstName, lastName, phoneNumber, email, password, city, country, dateofbirthday } = createUserDto
            
        const salt = await bcrypt.genSalt()

        const passwordHashed = await bcrypt.hash(password, salt)
        
        let user = new User()
        user.firstName = firstName;
        user.lastName = lastName;
        user.phoneNumber = phoneNumber;
        user.email = email;
        user.password = passwordHashed;
        user.city = city;
        user.country = country;
        user.dateofbirthday = new Date(dateofbirthday);

        return await this.userRepository.save(user)
    }

    async remove(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }

    async getActivitiesFav(user: User): Promise<Activities[]> {
        if (!user) {
            throw new BadRequestException('User must be provided');
        }
    
        const favorites = user.favoritsActivities ?? [];
    
        if (favorites.length === 0) {
            throw new NotFoundException('No favorite activities found for this user');
        }
    
        return favorites;
    }

    async addActivitiFav(activityId: number, user: User) {
        const activity = await this.activitiesRepository.findOne({ where: { id: activityId } });
        if (!activity) throw new NotFoundException("Activity not found");
        
        const fullUser = await this.userRepository.findOne({
            where: { id: user.id },
            relations: ['favoritsActivities'],
        });
        
        const isAlreadyFavorite = fullUser.favoritsActivities.find(fav => fav.id === activity.id);
        if (!isAlreadyFavorite) {
            fullUser.favoritsActivities.push(activity);
            await this.userRepository.save(fullUser);
        }
    }

    async removeActivitiFav(activityId: number, user: User) {
        const activity = await this.activitiesRepository.findOne({ where: { id: activityId } });
        if (!activity) throw new NotFoundException("Activity not found");
    
        const fullUser = await this.userRepository.findOne({ 
            where: { id: user.id }, 
            relations: ['favoritsActivities'] 
        });
        if (!fullUser) throw new NotFoundException("User not found");
    
        const isFavorite = fullUser.favoritsActivities.some(fav => fav.id === activity.id);
        if (!isFavorite) throw new BadRequestException("Activity is not in user's favorites");
    
        fullUser.favoritsActivities = fullUser.favoritsActivities.filter(fav => fav.id !== activity.id);
        await this.userRepository.save(fullUser);
    }

    async getRestauFav(user: User): Promise<Restaurant[]> {
        if (!user) {
            throw new BadRequestException('User must be provided');
        }
    
        const favorites = user.favoritsRestaurants ?? [];
    
        if (favorites.length === 0) {
            throw new NotFoundException('No favorite activities found for this user');
        }
    
        return favorites;
    }

    async addRestauFav(restaurantId: number, user: User) {
        const restaurant = await this.restaurantsRepository.findOne({ where: { id: restaurantId } });
        if (!restaurant) throw new NotFoundException("Activity not found");

        const fullUser = await this.userRepository.findOne({
            where: { id: user.id },
            relations: ['favoritsActivities'],
        });
    
        const isAlreadyFavorite = fullUser.favoritsActivities.find(fav => fav.id === restaurant.id);
        if (!user.favoritsRestaurants.some(fav => fav.id === restaurant.id)) {
            user.favoritsRestaurants.push(restaurant);
            await this.userRepository.save(user);
        }
    }

    async removeRestaurantFav(restaurantId: number, user: User) {
        const restaurant = await this.restaurantsRepository.findOne({ where: { id: restaurantId } });
        if (!restaurant) throw new NotFoundException("Restaurant not found");
    
        const fullUser = await this.userRepository.findOne({ 
            where: { id: user.id }, 
            relations: ['favoritsActivities'] 
        });
        if (!fullUser) throw new NotFoundException("User not found");
    
        const isFavorite = fullUser.favoritsRestaurants.some(fav => fav.id === restaurant.id);
        if (!isFavorite) throw new BadRequestException("Restaurant is not in user's favorites");
    
        fullUser.favoritsRestaurants = fullUser.favoritsRestaurants.filter(fav => fav.id !== restaurant.id);
        await this.userRepository.save(fullUser);
    }
}
