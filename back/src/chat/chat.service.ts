import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from 'src/user/user.entity'; // à adapter selon ton architecture
import { Message } from 'src/message/message.entity';
import { Channel } from 'src/channel/channel.entity';
import { Planning } from 'src/planning/planning.entity';
import { ActivityDay } from 'src/activity_day/activity-day.entity';
import { CreateClashDto } from 'src/clash/dto/create-clash.dto';
import { Clash } from 'src/clash/clash.entity';
import { Activities } from 'src/activities/activities.entity';
import { Restaurant } from 'src/restaurant/restaurant.entity';
import { Vote } from 'src/vote/vote.entity';
import { VoteDto } from 'src/clash/dto/create-vote.dto';

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

        @InjectRepository(Clash)
        private clashRepository: Repository<Clash>,

        @InjectRepository(Vote)
        private voteRepository: Repository<Vote>,

        @InjectRepository(Activities)
        private activitiesRepository: Repository<Activities>,

        @InjectRepository(Restaurant)
        private restaurantRepository: Repository<Restaurant>,
    ) { }

    async saveMessage(channelId: number, content: string, client: User): Promise<Message> {
        const channel = await this.channelRepository.findOne({ where: { id: channelId } });
        if (!channel) throw new NotFoundException('Channel not found');

        const message = new Message();

        message.content = content
        message.channel = channel
        message.author = client

        return await this.messageRepository.save(message);
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
            relations: ['morningActivity', 'noondayActivity', 'afternoonActivity', 'eveningActivity', 'nightActivity', 'breakfastRestaurant', 'lunchRestaurant', 'dinnerRestaurant'],
        });

        if (!activityDay) {
            throw new NotFoundException('Activity Day not found for this group');
        }

        return activityDay;
    }

    async getClashsByChannel(channelId: number, userId: number) {
        const channel = await this.channelRepository.findOne({
            where: { id: channelId },
            relations: ['clashes'],
        });

        if (!channel || !channel.clashes) {
            throw new NotFoundException('Channel or clashes not found');
        }

        const clashes = await this.clashRepository.find({
            where: { channel: { id: channel.id } },
            relations: ['creator', 'activityOptionA', 'activityOptionB', 'restaurantOptionA', 'restaurantOptionB', 'votes', 'channel'],
        });

        if (!clashes || clashes.length === 0) {
            throw new NotFoundException('Clashes not found for this group');
        }

        const clashIds = clashes.map(c => c.id);

        const votes = await this.voteRepository.find({
            where: {
                clash: { id: In(clashIds) },
            },
            relations: ['user', 'clash'],
        });

        return clashes.map(clash => {
            const clashVotes = votes.filter(v => v.clash.id === clash.id);
            const votesA = clashVotes.filter(v => v.option === 'A').length;
            const votesB = clashVotes.filter(v => v.option === 'B').length;

            const userVote = clashVotes.find(v => v.user.id === userId)?.option || null;

            return {
                ...clash,
                votes: clashVotes,
                votesA,
                votesB,
                userVote,
            };
        });
    }

    async createClash(createClashDto: CreateClashDto, creator: User): Promise<Clash> {
        const { channelId, optionAId, optionBId, type } = createClashDto;

        const channel = await this.channelRepository.findOne({
            where: { id: channelId },
            relations: ['groupe', 'groupe.members', 'groupe.creator'],
        });

        if (!channel) throw new NotFoundException('Channel not found');

        const group = channel.groupe;

        const isCreator = group.creator.id === creator.id;
        const isMember = group.members.some(member => member.id === creator.id);

        if (!isCreator && !isMember) {
            throw new ForbiddenException("You are not authorized to create a clash in this group.");
        }

        if (optionAId === optionBId) {
            throw new BadRequestException(`${type === 'activity' ? 'Activities' : 'Restaurants'} must be different`);
        }

        const clash = new Clash();
        clash.creator = creator;
        clash.channel = channel;

        if (type === 'activity') {
            const [activityA, activityB] = await Promise.all([
                this.activitiesRepository.findOne({ where: { id: optionAId } }),
                this.activitiesRepository.findOne({ where: { id: optionBId } }),
            ]);

            if (!activityA || !activityB) throw new NotFoundException('Activity not found');

            clash.activityOptionA = activityA;
            clash.activityOptionB = activityB;

        } else if (type === 'restaurant') {
            const [restaurantA, restaurantB] = await Promise.all([
                this.restaurantRepository.findOne({ where: { id: optionAId } }),
                this.restaurantRepository.findOne({ where: { id: optionBId } }),
            ]);

            if (!restaurantA || !restaurantB) throw new NotFoundException('Restaurant not found');

            clash.restaurantOptionA = restaurantA;
            clash.restaurantOptionB = restaurantB;

        } else {
            throw new BadRequestException('Invalid clash type');
        }

        return await this.clashRepository.save(clash);
    }


    async submitVote(voteDto: VoteDto, user: User): Promise<Vote> {
        const { clashId, option } = voteDto;

        const clash = await this.clashRepository.findOne({
            where: { id: clashId },
            relations: ['channel', 'channel.groupe', 'channel.groupe.members', 'channel.groupe.creator'],
        });

        if (!clash) {
            throw new NotFoundException('Clash not found');
        }

        const group = clash.channel.groupe;
        const isCreator = group.creator.id === user.id;
        const isMember = group.members.some(member => member.id === user.id);

        if (!isCreator && !isMember) {
            throw new ForbiddenException("You are not authorized to vote on this clash.");
        }

        const existingVote = await this.voteRepository.findOne({
            where: {
                clash: { id: clashId },
                user: { id: user.id },
            },
        });

        if (existingVote) {
            throw new ConflictException('You have already voted on this clash.');
        }

        const vote = new Vote();
        vote.clash = clash;
        vote.option = option;
        vote.user = user;

        return await this.voteRepository.save(vote);
    }

    async getAllActivities(): Promise<Activities[]> {
        return this.activitiesRepository.find({
            relations: ['categActiv', 'favorits'],
            order: { name: 'ASC' },
        });
    }

    async getAllRestaurants(): Promise<Restaurant[]> {
        return this.restaurantRepository.find({
            relations: ['categRestau', 'favorits'],
            order: { name: 'ASC' },
        });
    }

    async getClashWithVotes(clashId: number, userId: number) {
        const clash = await this.clashRepository.findOne({
            where: { id: clashId },
            relations: [
                'activityOptionA',
                'activityOptionB',
                'restaurantOptionA',
                'restaurantOptionB',
                'channel',
            ],
        });

        if (!clash) {
            throw new NotFoundException('Clash not found');
        }

        const votes = await this.voteRepository.find({
            where: { clash: { id: clashId } },
            relations: ['user'],
        });

        const votesA = votes.filter(v => v.option === 'A').length;
        const votesB = votes.filter(v => v.option === 'B').length;

        const userVote = votes.find(v => v.user?.id === userId);

        return {
            ...clash,
            votesA,
            votesB,
            userVote: userVote?.option || null,
        };
    }
}