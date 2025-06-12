import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity'; // à adapter selon ton architecture
import { Message } from 'src/message/message.entity';
import { Channel } from 'src/channel/channel.entity';
import { Planning } from 'src/planning/planning.entity';
import { ActivityDay } from 'src/activity_day/activity-day.entity';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,

        @InjectRepository(Channel)
        private readonly channelRepository: Repository<Channel>,

        @InjectRepository(Planning)
        private readonly planningRepository: Repository<Planning>,

        @InjectRepository(ActivityDay)
        private readonly activityDayRepository: Repository<ActivityDay>,
    ) {}

    async saveMessage(channelId: number, content: string, client: User): Promise<Message> {
        const channel = await this.channelRepository.findOne({ where: { id : channelId } });
        if (!channel) throw new NotFoundException('Channel not found');

        const message = new Message();

        message.content = content
        message.channel = channel
        message.author = client

        message.save()

        return message;
    }

    async getMessages(channelId: number): Promise<Message[]> {
        return await this.messageRepository.find({
            where: { channel: { id: channelId } },
            relations: ['channel', 'author'],
            order: { createdAt: 'ASC' },
        });
    }

    async getPlanningByChannel(channelId: number): Promise<ActivityDay[] | null> {
        const channel = await this.channelRepository.findOne({
            where: { id: channelId },
            relations: ['groupe'],
        });

        if (!channel || !channel.groupe) {
            throw new NotFoundException('Channel or group not found');
        }

        const planning = await this.planningRepository.findOne({
            where: { group: { id: channel.groupe.id } },
            relations: ['activitiesDay', 'user'],
        });

        if (!planning) {
            throw new NotFoundException('Planning not found for this group');
        }

        const activityDay = await this.activityDayRepository.find({
            where: { planning: { id: planning.id } },
            relations: ['morningActivity', 'noondayActivity','afternoonActivity','eveningActivity','nightActivity','breakfastRestaurant','lunchRestaurant','dinnerRestaurant'],
        });

        if (!activityDay) {
            throw new NotFoundException('Activity Day not found for this group');
        }

        return activityDay;
    }
}