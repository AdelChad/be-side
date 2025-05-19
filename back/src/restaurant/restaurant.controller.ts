import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { RestaurantService } from './restaurant.service';
import { Roles } from 'src/decorators/role.decorator';
import { AuthGuard } from 'src/guard/auth.guard';
import { UserRequest } from 'src/interface/user-request.interface';
import { UserService } from 'src/user/user.service';
import { FilterRestaurantsDto } from './dto/filter-restaurants.dto';

@Controller('restaurants')
export class RestaurantController {
    constructor(private restaurantsService: RestaurantService, private userService: UserService) { }

    @UseGuards(AuthGuard)
    @Roles(['user'])
    @Get()
    async getAllRestaurant(): Promise<Restaurant[]> {
        return this.restaurantsService.getAllRestaurant()
    }

    @UseGuards(AuthGuard)
    @Roles(['user'])
    @Get("by-categ")
    async restaurantsByCateg(@Query('categRestau') query: string): Promise<Array<Restaurant> | HttpException> {
        let categRestauName = query.split(',')
        return this.restaurantsService.restaurantsByCateg(categRestauName);
    }

    @UseGuards(AuthGuard)
    @Roles(['user'])
    @Post('filter')
    async filterRestaurants(
        @Body() filterDto: FilterRestaurantsDto,
        @Req() request
    ): Promise<Array<Restaurant> | HttpException> {
        const userRequest: UserRequest = request.user;
        const user = await this.userService.findOne(userRequest.email);

        return this.restaurantsService.filterRestaurants(filterDto, user);
    }


    @Get("carrousel")
    async restaurantsForCarrousel(@Req() request): Promise<Array<Restaurant> | HttpException> {
        return this.restaurantsService.RestaurantsMainCity();
    }

    @UseGuards(AuthGuard)
    @Roles(['user'])
    @Get(":id")
    async findOneRestaurants(@Param('id', ParseIntPipe) id: number): Promise<Restaurant | HttpException> {
        let restaurants = await this.restaurantsService.restaurantRepository.findOne({ where: { id: id }, relations: { categRestau: true } })

        if (restaurants) {
            return restaurants
        } else {
            return new HttpException("L'id deu restaurant n'existe pas ou n'est peut etre pas le bon", HttpStatus.BAD_REQUEST)
        }
    }

    @UseGuards(AuthGuard)
    @Roles(['admin'])
    @Delete(":id")
    async Deleterestaurant(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
        return await this.restaurantsService.restaurantRepository.delete(id)
    }
}
