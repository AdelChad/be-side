import { Module } from '@nestjs/common';
import { GoogleApiController } from './google-api.controller';
import { GoogleApiService } from './google-api.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activities } from 'src/activities/activities.entity';
import { GoogleFunction } from 'src/utils/Google';
import { CategActiv } from 'src/categ_activ/categ_activ.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Activities, CategActiv])],
    controllers: [GoogleApiController],
    providers: [GoogleApiService, GoogleFunction],
    exports: [GoogleApiService, GoogleFunction]
})
export class GoogleApiModule { }
