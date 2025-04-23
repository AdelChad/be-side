import { Module } from '@nestjs/common';
import { GoogleApiController } from './google-api.controller';
import { GoogleApiService } from './google-api.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activities } from 'src/activities/activities.entity';
import { GoogleFunction } from 'src/utils/Google';
import { CategActiv } from 'src/categ_activ/categ_activ.entity';
import { CategRestau } from 'src/categ_restau/categ_restau.entity';
import { Restaurant } from 'src/restaurant/restaurant.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Activities, Restaurant, CategActiv, CategRestau])],
    controllers: [GoogleApiController],
    providers: [GoogleApiService, GoogleFunction],
    exports: [GoogleApiService, GoogleFunction]
})
export class GoogleApiModule { }
