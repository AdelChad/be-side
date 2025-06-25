import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Planning } from './planning.entity';
import { Repository } from 'typeorm';
import { ActivityDay } from 'src/activity_day/activity-day.entity';
import { User } from 'src/user/user.entity';
import { PlanningCreateDto } from './dto/create-planning.dto';
import { Activities } from 'src/activities/activities.entity';
import { PlanningUpdateDto } from './dto/modify-planning.dto';
import { Groupe } from 'src/groupe/groupe.entity';
import { Restaurant } from 'src/restaurant/restaurant.entity';

@Injectable()
export class PlanningService {
    constructor(
        @InjectRepository(Planning)
        public planningRepository: Repository<Planning>,

        @InjectRepository(Activities)
        public activitiesRepository: Repository<Activities>,

        @InjectRepository(Restaurant)
        public restaurantsRepository: Repository<Restaurant>,

        @InjectRepository(Groupe)
        public groupeRepository: Repository<Groupe>,
    ) { }

    async getAllPlannings(user: User): Promise<Planning[]> {
        return await this.planningRepository.find({
            where: { user: { id: user.id } },
            relations: {
                activitiesDay: {
                    morningActivity: true,
                    noondayActivity: true,
                    afternoonActivity: true,
                    eveningActivity: true,
                    nightActivity: true
                },
            }
        });
    }

    async createPlanning(activitiesCreateDto: PlanningCreateDto, user: User): Promise<Planning> {
        try {
            const { name, date, activities, restaurants, groupeId } = activitiesCreateDto;
        
            const fullActivities = await Promise.all(
                activities.map(({ id }) => this.activitiesRepository.findOne({ where: { id } }))
            );

            const fullRestaurants = await Promise.all(
                restaurants.map(({ id }) => this.restaurantsRepository.findOne({ where: { id } }))
            );

            const planning = new Planning();

            if (groupeId) {
                const groupe = await this.groupeRepository.findOne({ where: { id: groupeId } });
                if (!groupe) {
                    throw new HttpException(`Groupe with ID ${groupeId} not found`, HttpStatus.NOT_FOUND);
                }
                planning.group = groupe;
            }
            else{
                planning.group = null
            }
        
            planning.name = name;
            planning.user = user;
        
            const activityDay = new ActivityDay();
            activityDay.date = date;
            activityDay.planning = planning;
        
            activities.forEach(({ time }, index) => {
                const activity = fullActivities[index];
                if (!activity) return;
        
                switch (time) {
                    case 'morningActivity':
                        activityDay.morningActivity = activity;
                        break;
                    case 'noondayActivity':
                        activityDay.noondayActivity = activity;
                        break;
                    case 'afternoonActivity':
                        activityDay.afternoonActivity = activity;
                        break;
                    case 'eveningActivity':
                        activityDay.eveningActivity = activity;
                        break;
                    case 'nightActivity':
                        activityDay.nightActivity = activity;
                        break;
                }
            });

            restaurants.forEach(({ time }, index) => {
                const restaurant = fullRestaurants[index];
                if (!restaurant) return;
        
                switch (time) {
                    case 'breakfastRestaurant':
                        activityDay.breakfastRestaurant = restaurant;
                        break;
                    case 'lunchRestaurant':
                        activityDay.lunchRestaurant = restaurant;
                        break;
                    case 'dinnerRestaurant':
                        activityDay.dinnerRestaurant = restaurant;
                        break;
                }
            });
        
            planning.activitiesDay = [activityDay];
        
            await planning.save();
            await activityDay.save();
          
            return {
                id: planning.id,
                name: planning.name,
                userId: planning.user.id,
                activitiesDay: planning.activitiesDay.map(ad => ({
                  date: ad.date,
                  morningActivity: ad.morningActivity,
                  noondayActivity: ad.noondayActivity,
                  afternoonActivity: ad.afternoonActivity,
                  eveningActivity: ad.eveningActivity,
                  nightActivity: ad.nightActivity,
                }))
              } as any;
        } catch (error) {
          console.log(error);
          throw new HttpException('Erreur lors de la création du planning', HttpStatus.BAD_REQUEST);
        }
    }

    async modifyActivityDay(activitiesDayUpdateDto: PlanningUpdateDto, user: User): Promise<Planning> {
        try {
            const { id, date, activities, restaurants, groupeId } = activitiesDayUpdateDto;
        
            const planning = await this.planningRepository.findOne({
                where: { id },
                relations: {
                user: true,
                activitiesDay: {
                    morningActivity: true,
                    noondayActivity: true,
                    afternoonActivity: true,
                    eveningActivity: true,
                    nightActivity: true,
                },
                },
            });
        
            if (!planning || planning.user.id !== user.id) {
                throw new HttpException('Accès non autorisé à ce planning', HttpStatus.UNAUTHORIZED);
            }

            const activityDay = planning.activitiesDay[0];
            if (!activityDay) {
                throw new HttpException('Aucun ActivityDay trouvé pour ce planning', HttpStatus.NOT_FOUND);
            }

            if (groupeId) {
                const groupe = await this.groupeRepository.findOne({ where: { id: groupeId } });
                if (!groupe) {
                    throw new HttpException(`Groupe with ID ${groupeId} not found`, HttpStatus.NOT_FOUND);
                }
                planning.group = groupe;
            }
            else{
                planning.group = null
            }
        
            const fullActivities = await Promise.all(
                activities.map(({ id }) => this.activitiesRepository.findOne({ where: { id } }))
            );

            const fullRestaurants = await Promise.all(
                restaurants.map(({ id }) => this.restaurantsRepository.findOne({ where: { id } }))
            );
        
            activityDay.date = date;
            const times = ['morningActivity', 'noondayActivity', 'afternoonActivity', 'eveningActivity', 'nightActivity'];

            times.forEach(timeSlot => {
                const hasNewActivity = activities.some(a => a.time === timeSlot);

                if (hasNewActivity) {
                    activityDay[timeSlot] = null;
                }
            });

            activities.forEach(({ time }, index) => {
                const activity = fullActivities[index];
                if (!activity) return;

                switch (time) {
                    case 'morningActivity':
                        activityDay.morningActivity = activity;
                        break;
                    case 'noondayActivity':
                        activityDay.noondayActivity = activity;
                        break;
                    case 'afternoonActivity':
                        activityDay.afternoonActivity = activity;
                        break;
                    case 'eveningActivity':
                        activityDay.eveningActivity = activity;
                        break;
                    case 'nightActivity':
                        activityDay.nightActivity = activity;
                        break;
                }
            });

            restaurants.forEach(({ time }, index) => {
                const restaurant = fullRestaurants[index];
                if (!restaurant) return;
        
                switch (time) {
                    case 'breakfastRestaurant':
                        activityDay.breakfastRestaurant = restaurant;
                        break;
                    case 'lunchRestaurant':
                        activityDay.lunchRestaurant = restaurant;
                        break;
                    case 'dinnerRestaurant':
                        activityDay.dinnerRestaurant = restaurant;
                        break;
                }
            });
        
            await activityDay.save();
        
            planning.activitiesDay = [activityDay];
            await planning.save();
        
            return planning;
        } catch (error) {
            console.log(error);
            throw new HttpException('Erreur lors de la modification du planning', HttpStatus.BAD_REQUEST);
        }
    }

    async getPlanningById(id: number, user: User): Promise<Planning> {
        try {
            const planning = await this.planningRepository.findOne({
                where: { id },
                relations: {
                    user: true,
                    group: { members: true },
                    activitiesDay: {
                        morningActivity: true,
                        noondayActivity: true,
                        afternoonActivity: true,
                        eveningActivity: true,
                        nightActivity: true,
                        breakfastRestaurant: true,
                        lunchRestaurant: true,
                        dinnerRestaurant: true,
                    },
                },
            });

            if (!planning) {
                throw new HttpException(`Planning with ID ${id} not found`, HttpStatus.NOT_FOUND);
            }

            const isOwner = planning.user.id === user.id;
            const isGroupMember = planning.group?.members?.some(member => member.id === user.id);

            if (!isOwner && !isGroupMember) {
                throw new HttpException(`Access denied to this planning`, HttpStatus.FORBIDDEN);
            }

            return planning;

        } catch (error) {
            console.error(error);
            throw new HttpException('Error retrieving planning', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
