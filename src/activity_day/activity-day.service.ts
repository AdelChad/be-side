import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityDay } from './activity-day.entity';
import { Repository } from 'typeorm';
import { Activities } from 'src/activities/activities.entity';
import { ActivitiesService } from 'src/activities/activities.service';
import { UpdateActivityDto } from './dto/update-activityDay';
import { dayTimeMapping } from 'src/constantes/constantes';

@Injectable()
export class ActivityDayService {
    constructor(
        @InjectRepository(ActivityDay)
        public activityDayRepository: Repository<ActivityDay>,

        @InjectRepository(Activities)
        public activitiesRepository: Repository<Activities>,
    ) { }

    async getActivitiesOfTheDay() {
    }


    
    
    async createActivityDaY(dateOfTheJourney: string, activities: Activities[]) {
        //créer l'objet activityday
        try{

            let activityDay = await this.activityDayRepository.create()
    
            outerLoop: for (const activity of activities) {
                for (const daytime of activity.dayTime) {
                    const property = dayTimeMapping[daytime]; 
                    if (property && activityDay[property] === undefined) {
                        activityDay[property] = activity; 
                        continue outerLoop;
    
                    }
                }
            }
    
            activityDay.date = new Date(dateOfTheJourney)
    
    
            return await activityDay.save()
        }catch{
            throw new HttpException('Some Problems on Creating day Activity', HttpStatus.BAD_REQUEST)
        }
    }

    async addActivityInDay(id: number, updateActivityDto: UpdateActivityDto): Promise<ActivityDay> {
        const { idActivities, date, daytime } = updateActivityDto
        let activityDay = await this.activityDayRepository.findOne({ where: { id: id }, 
            relations: { 
                morningActivity: true, 
                noondayActivity: true, 
                afternoonActivity: true, 
                nightActivity: true, 
                eveningActivity: true 
            } 
        });
        let activities = await this.activitiesRepository.findOneBy({ id: idActivities })

        if (date !== null) {
            activityDay.date = new Date(date)
        }
        const property = dayTimeMapping[daytime]
        activityDay[property] = activities

        return await activityDay.save()
    }


    async deleteActivityInDay(id: number, updateActivityDto: UpdateActivityDto): Promise<ActivityDay> {
        const { daytime } = updateActivityDto
        let activityDay = await this.activityDayRepository.findOne({ where: { id: id }, 
            relations: { morningActivity: true, noondayActivity: true, afternoonActivity: true, nightActivity: true, eveningActivity: true } 
        });

        const property = dayTimeMapping[daytime]
        activityDay[property] = []
        return await activityDay.save()
    }
}
