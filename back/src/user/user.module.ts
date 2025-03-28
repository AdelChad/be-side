import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Restaurant } from 'src/restaurant/restaurant.entity';
import { Activities } from 'src/activities/activities.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Restaurant, Activities])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
