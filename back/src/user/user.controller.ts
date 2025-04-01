import { Controller, Get, Post, Delete, Param, Body, UseGuards, Req, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UserCreateDto } from './dto/create-user.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { Roles } from 'src/decorators/role.decorator';
import { Activities } from 'src/activities/activities.entity';
import { UserRequest } from 'src/interface/user-request.interface';
import { Restaurant } from 'src/restaurant/restaurant.entity';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }

    @UseGuards(AuthGuard)
    @Roles(['user'])
    @Get()
    findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Get(':email')
    findOne(@Param('email') email: string): Promise<User> {
        return this.userService.findOne(email);
    }

    @Post()
    create(@Body() createUserDto: UserCreateDto): Promise<User> {
        return this.userService.create(createUserDto);
    }

    @UseGuards(AuthGuard)
    @Roles(['user'])
    @Post('add_activite_fav')
    async addFavoriteActivities(@Body() activitie: Activities, @Req() request): Promise<void> {
        const id: number = activitie.id
        const userRequest: UserRequest = request.user
        const user = await this.userService.findOne(userRequest.email)
    
        return this.userService.addActivitiFav(id, user);
    }

    @UseGuards(AuthGuard)
    @Roles(['user'])
    @Post('remove_activite_fav')
    async removeFavoriteActivity(@Body() activitie: Activities, @Req() request): Promise<void> {
        const id: number = activitie.id;
        const userRequest: UserRequest = request.user;
        const user = await this.userService.findOne(userRequest.email);

        return this.userService.removeActivitiFav(id, user);
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
    @Post('remove_activite_fav')
    async removeFavoriteRestaurant(@Body() restaurant: Restaurant, @Req() request): Promise<void> {
        const id: number = restaurant.id
        const userRequest: UserRequest = request.user
        const user = await this.userService.findOne(userRequest.email)

        return this.userService.removeRestaurantFav(id, user);
    }

    @Delete(':id')
    remove(@Param('id') id: string): Promise<void> {
        return this.userService.remove(+id);
    }
}
