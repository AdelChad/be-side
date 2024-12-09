import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Planning } from './planning.entity';
import { Repository } from 'typeorm';
import { ActivityDay } from 'src/activity_day/activity-day.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class PlanningService {
    constructor(
        @InjectRepository(Planning)
        public planningRepository: Repository<Planning>
    ) { }

    async createPlanning(activities: ActivityDay[], user: User): Promise<Planning> {

        try{

            const planning = new Planning();
            planning.name = 'DefaultName';
            planning.activitiesDay = activities;
            planning.user = user;

            return await planning.save();
        }catch{
            throw new HttpException(` Some problems on Creation Planning `, HttpStatus.BAD_REQUEST);
        }

    }

    async getAllPlannings(): Promise<Planning[]> {
        return await this.planningRepository.find({ relations: { activitiesDay: true } });
    }

    async getPlanningById(id: number): Promise<Planning> {
        const planning = await this.planningRepository.findOne({
            where: { id },
            relations: {
                activitiesDay: {
                    morningActivity: true, 
                    noondayActivity: true, 
                    afternoonActivity: true, 
                    nightActivity: true, 
                    eveningActivity: true 
                },
            },
        });

        if (!planning) {
            throw new HttpException(`Planning with ID ${id} not found`, HttpStatus.NOT_FOUND);
        }

        return planning;
    }

    async addActivityDay(id: number): Promise<Planning> {
        const planning = await this.planningRepository.findOne({
            where: { id: id },
            relations: {
                activitiesDay: {
                    morningActivity: true, 
                    noondayActivity: true, 
                    afternoonActivity: true, 
                    nightActivity: true, 
                    eveningActivity: true 
                }
            }
        });
        if (planning !== null) {

            const activityDay = new ActivityDay();

            activityDay.date = new Date();
            activityDay.planning = planning;
            activityDay.morningActivity = null;
            activityDay.noondayActivity = null;
            activityDay.afternoonActivity = null;
            activityDay.eveningActivity = null;
            activityDay.nightActivity = null;
            activityDay.save();

            return planning

        }

    }
}
