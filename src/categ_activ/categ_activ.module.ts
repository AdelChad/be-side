import { Module } from '@nestjs/common';
import { CategController } from './categ_activ.controller';
import { CategService } from './categ_activ.service';
import { CategActiv } from './categ_activ.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activities } from 'src/activities/activities.entity';


@Module({
  imports: [TypeOrmModule.forFeature([CategActiv, Activities])],
  controllers: [CategController],
  providers: [CategService],
})
export class CategModule { }