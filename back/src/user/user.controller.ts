import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Patch,
  Req,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UserCreateDto } from './dto/create-user.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { Roles } from 'src/decorators/role.decorator';
import { Activities } from 'src/activities/activities.entity';
import { UserRequest } from 'src/interface/user-request.interface';
import { Restaurant } from 'src/restaurant/restaurant.entity';
import { SearchActivityRestaurantDto } from './dto/generate-restaurants-pos.dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) { }

  @UseGuards(AuthGuard)
  @Roles(['user'])
  @Get('me/')
  async getUser(@Req() request): Promise<User> {

    const userRequest: UserRequest = request.user
    console.log(request.user);
    const user = await this.userService.findOne(userRequest.email)

    if (!user) {
      throw new HttpException(`__The User with email:${userRequest.email} doesn't exist`, HttpStatus.BAD_REQUEST)
    }

    return user
  }

  @UseGuards(AuthGuard)
  @Roles(['user'])
  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  // @UseGuards(AuthGuard)
  // @Roles(['user'])
  // @Get('search_activities_restaurant')
  // async searchActivityRestaurant(@Body() searchActivityRestaurant: SearchActivityRestaurantDto, @Req() request): Promise<Activities[] | Restaurant[]> {
  //   const userRequest: UserRequest = request.user
  //   const user = await this.userService.findOne(userRequest.email)

  //   return this.userService.searchActivitiesRestaurant(searchActivityRestaurant, user);
  // }

  @UseGuards(AuthGuard)
  @Roles(['user'])
  @Get('search_activities_restaurant')
  async searchActivityRestaurant(
    @Query() searchActivityRestaurant: SearchActivityRestaurantDto,
    @Req() request
  ): Promise<{ activities: Activities[]; restaurants: Restaurant[] }> {
    const userRequest: UserRequest = request.user;
    const user = await this.userService.findOne(userRequest.email);
    return this.userService.searchActivitiesRestaurant(searchActivityRestaurant, user);
  }


  @UseGuards(AuthGuard)
  @Roles(['user'])
  @Get('get_activities_fav')
  async getFavoriteActivites(@Req() request): Promise<Activities[]> {
    const userRequest: UserRequest = request.user
    const user = await this.userService.findOne(userRequest.email)

    return this.userService.getActivitiesFav(user);
  }

  @UseGuards(AuthGuard)
  @Roles(['user'])
  @Post('add_activitie_fav')
  async addFavoriteActivities(@Body() activitie: Activities, @Req() request): Promise<void> {
    const id: number = activitie.id
    const userRequest: UserRequest = request.user
    const user = await this.userService.findOne(userRequest.email)

    return this.userService.addActivitiFav(id, user);
  }

  @UseGuards(AuthGuard)
  @Roles(['user'])
  @Post('remove_activitie_fav')
  async removeFavoriteActivity(@Body() activitie: Activities, @Req() request): Promise<void> {
    const id: number = activitie.id;
    const userRequest: UserRequest = request.user;
    const user = await this.userService.findOne(userRequest.email);

    return this.userService.removeActivitiFav(id, user);
  }

  @UseGuards(AuthGuard)
  @Roles(['user'])
  @Get('get_restaurants_fav')
  async getFavoriteRestaurants(@Req() request): Promise<Restaurant[]> {
    const userRequest: UserRequest = request.user
    const user = await this.userService.findOne(userRequest.email)

    return this.userService.getRestauFav(user);
  }

  @UseGuards(AuthGuard)
  @Roles(['user'])
  @Post('add_restaurant_fav')
  async addFavoriteRestaurant(@Body() restaurant: Restaurant, @Req() request): Promise<void> {
    const id: number = restaurant.id
    const userRequest: UserRequest = request.user
    const user = await this.userService.findOne(userRequest.email)

    return this.userService.addRestauFav(id, user);
  }

  @UseGuards(AuthGuard)
  @Roles(['user'])
  @Post('remove_restaurant_fav')
  async removeFavoriteRestaurant(@Body() restaurant: Restaurant, @Req() request): Promise<void> {
    const id: number = restaurant.id
    const userRequest: UserRequest = request.user
    const user = await this.userService.findOne(userRequest.email)

    return this.userService.removeRestaurantFav(id, user);
  }

  @Get(':email')
  findOne(@Param('email') email: string): Promise<User> {
    return this.userService.findOne(email);
  }

  @Post()
  create(@Body() CreateUserDto: UserCreateDto): Promise<User> {
    return this.userService.create(CreateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(+id);
  }

  @UseGuards(AuthGuard)
  @Post(':id/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/profile-pictures',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callback(
            new Error('Seuls les fichiers JPG, JPEG, PNG sont autorisés !'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async uploadProfilePicture(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new HttpException('Fichier manquant', HttpStatus.BAD_REQUEST);
    }
    return this.userService.updateProfilePicture(id, file.filename);
  }

  @UseGuards(AuthGuard)
  @Delete(':id/profile-picture')
  async deleteProfilePicture(@Param('id') id: number) {
    return this.userService.deleteProfilePicture(id);
  }

}
