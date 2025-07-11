import { HttpException, HttpStatus, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import { User } from './user.entity';
import { Activities } from 'src/activities/activities.entity';
import { Restaurant } from 'src/restaurant/restaurant.entity';
import * as bcrypt from 'bcrypt';
import { UserCreateDto } from './dto/create-user.dto';
import * as path from 'path';
import * as fs from 'fs';
import { SearchActivityRestaurantDto } from './dto/generate-restaurants-pos.dto';
import { GoogleApiService } from 'src/google-api/google-api.service';
import { Trigonometrie } from 'src/utils/trigonometrie';


type SearchResults = {
  activities: Activities[];
  restaurants: Restaurant[];
};
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Activities)
    public activitiesRepository: Repository<Activities>,

    @InjectRepository(Restaurant)
    public restaurantsRepository: Repository<Restaurant>,

    public trigonometrie: Trigonometrie,

    public googleApi: GoogleApiService,
  ) { }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { email } })

    if (user) {
      return user
    }

    throw new HttpException(`Aucun utilisateur trouvé avec l'email : ${email}`, HttpStatus.NOT_FOUND);
  }

  async create(createUserDto: UserCreateDto) {
    const {
      firstName,
      lastName,
      phoneNumber,
      email,
      password,
      city,
      country,
      dateofbirthday,
      profilePicture,
    } = createUserDto;

    const salt = await bcrypt.genSalt();

    const passwordHashed = await bcrypt.hash(password, salt);

    const user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.phoneNumber = phoneNumber;
    user.email = email;
    user.password = passwordHashed;
    user.city = city;
    user.country = country;
    user.dateofbirthday = new Date(dateofbirthday);
    user.profilePicture = profilePicture || null;

    return await this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async updateProfilePicture(id: number, filename: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    if (user.profilePicture && typeof user.profilePicture === 'string') {
      const oldPath = path.join(
        process.cwd(),
        'uploads/profile-pictures',
        user.profilePicture,
      );
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    user.profilePicture = filename;
    return this.userRepository.save(user);
  }

  async deleteProfilePicture(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    if (user.profilePicture) {
      const oldPath = path.join(process.cwd(), 'uploads', 'profile-pictures', user.profilePicture);

      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    user.profilePicture = null;
    return this.userRepository.save(user);
  }

  async searchActivitiesRestaurant(searchActivityRestaurant: SearchActivityRestaurantDto, user: User): Promise<{ activities: Activities[]; restaurants: Restaurant[] }> {
    const { search, city, tags, type } = searchActivityRestaurant;
    const cityRecovered = city?.trim() || user.city?.trim();

    if (!cityRecovered) {
      throw new BadRequestException('Aucune ville disponible pour la recherche');
    }

    const geocodeAddress = await this.googleApi.getAddresseGeocode(cityRecovered);
    const activities: Activities[] = [];
    const restaurants: Restaurant[] = [];

    const tagArray = tags ? tags.split(',').map(tag => tag.trim()) : [];

    if (!type || type === 'restaurant') {
      const where: any = {};
      if (search) where.name = Like(`%${search}%`);
      if (tagArray.length > 0) {
        where.categRestau = { name: In(tagArray) };
      }

      const qb = this.restaurantsRepository.createQueryBuilder('restaurant').leftJoinAndSelect('restaurant.categRestau', 'categ').where('1=1');

      if (search) {
        qb.andWhere('restaurant.name LIKE :search', { search: `%${search}%` });
      }

      if (tagArray.length > 0) {
        qb.andWhere('categ.name IN (:...tags)', { tags: tagArray });
      }

      const foundRestaurants = await qb.getMany();

      restaurants.push(...foundRestaurants.filter(r => this.trigonometrie.distance(geocodeAddress, r)));
    }

    if (!type || type === 'activity') {
      const where: any = {};
      if (search) where.name = Like(`%${search}%`);
      if (tagArray.length > 0) {
        where.categActiv = { name: In(tagArray) };
      }

      const qb = this.activitiesRepository.createQueryBuilder('activity').leftJoinAndSelect('activity.categActiv', 'categ').where('1=1');

      if (search) {
        qb.andWhere('activity.name LIKE :search', { search: `%${search}%` });
      }

      if (tagArray.length > 0) {
        qb.andWhere('categ.name IN (:...tags)', { tags: tagArray });
      }

      const foundActivities = await qb.getMany();

      activities.push(...foundActivities.filter(a => this.trigonometrie.distance(geocodeAddress, a)));
    }

    return { activities, restaurants };
  }

  async getActivitiesFav(user: User): Promise<Activities[]> {
    const fullUser = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['favoritsActivities']
    });
    if (!user) {
      throw new BadRequestException('User must be provided');
    }

    const favorites = fullUser.favoritsActivities ?? [];

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
    const fullUser = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['favoritsRestaurants']
    });
    if (!user) {
      throw new BadRequestException('User must be provided');
    }

    const favorites = fullUser.favoritsRestaurants ?? [];

    if (favorites.length === 0) {
      throw new NotFoundException('No favorite Restaurants found for this user');
    }

    return favorites;
  }

  async addRestauFav(restaurantId: number, user: User) {
    const restaurant = await this.restaurantsRepository.findOne({ where: { id: restaurantId } });
    if (!restaurant) throw new NotFoundException("Restaurant not found");

    const fullUser = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['favoritsRestaurants'],
    });

    const isAlreadyFavorite = fullUser.favoritsRestaurants.find(fav => fav.id === restaurant.id);
    if (!isAlreadyFavorite) {
      fullUser.favoritsRestaurants.push(restaurant);
      await this.userRepository.save(fullUser);
    }
  }

  async removeRestaurantFav(restaurantId: number, user: User) {
    const restaurant = await this.restaurantsRepository.findOne({ where: { id: restaurantId } });
    if (!restaurant) throw new NotFoundException("Restaurant not found");

    const fullUser = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['favoritsRestaurants']
    });
    if (!fullUser) throw new NotFoundException("User not found");

    const isFavorite = fullUser.favoritsRestaurants.find(fav => fav.id === restaurant.id);
    if (!isFavorite) throw new BadRequestException("Restaurant is not in user's favorites");

    fullUser.favoritsRestaurants = fullUser.favoritsRestaurants.filter(fav => fav.id !== restaurant.id);
    await this.userRepository.save(fullUser);
  }
}
