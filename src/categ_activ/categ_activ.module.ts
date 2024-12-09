import { Module } from '@nestjs/common';
import { TagsController } from './categ_activ.controller';
import { TagsService } from './categ_activ.service';
import { CategActiv } from './categ_activ.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activities } from 'src/activities/activities.entity';


@Module({
  imports: [TypeOrmModule.forFeature([CategActiv, Activities])],
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule { }