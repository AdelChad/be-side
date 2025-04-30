import { Module } from '@nestjs/common';
import { CategRestauController } from './categ_restau.controller';
import { CategRestautService } from './categ_restau.service';
import { CategRestau } from './categ_restau.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from 'src/restaurant/restaurant.entity';


@Module({
  imports: [TypeOrmModule.forFeature([CategRestau, Restaurant])],
  controllers: [CategRestauController],
  providers: [CategRestautService],
})
export class CategRestauModule { }