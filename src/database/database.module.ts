import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Groupe } from 'src/groupe/groupe.entity';
import { Channel } from 'src/channel/channel.entity';
import { Message } from 'src/message/message.entity';
import { Activities } from 'src/activities/activities.entity';
import { ActivityDay } from 'src/activity_day/activity-day.entity';
import { Planning } from 'src/planning/planning.entity';
import { CategActiv } from 'src/categ_activ/categ_activ.entity';
import { Restaurant } from 'src/restaurant/restaurant.entity';
import { CategRestau } from 'src/categ_restau/categ_restau.entity';

require('dotenv').config();

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.getOrThrow('DB_HOST'),
        username: configService.getOrThrow('DB_USERNAME'),
        password: configService.getOrThrow('DB_PASSWORD'),
        database: configService.getOrThrow('DB_NAME'),
        entities: [ActivityDay, Activities, User, Planning, CategActiv, Groupe, Message, Channel, Restaurant, CategRestau],
        migrations: ['dist/migrations/**/*.js'],
        synchronize: false,
        logging: false,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule implements OnModuleInit {
  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    try {
      await this.dataSource.query('SELECT 1');
      console.log('✅ Database connection is healthy');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
    }
  }
}
