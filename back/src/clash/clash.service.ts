import { BadRequestException, ConflictException, ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote } from 'src/vote/vote.entity';
import { Clash } from './clash.entity';
import { User } from 'src/user/user.entity';
import { VoteDto } from './dto/create-vote.dto';
import { CreateClashDto } from './dto/create-clash.dto';
import { Channel } from 'src/channel/channel.entity';
import { Activities } from 'src/activities/activities.entity';
import { Restaurant } from 'src/restaurant/restaurant.entity';
import { GetVoteDto } from './dto/get-vote.dto';

@Injectable()
export class ClashService {
    constructor(
        @InjectRepository(Vote)
        private voteRepository: Repository<Vote>,

        @InjectRepository(Clash)
        private clashRepository: Repository<Clash>,

        @InjectRepository(Channel)
        private channelRepository: Repository<Channel>,

        @InjectRepository(Activities)
        private activitiesRepository: Repository<Activities>,

        @InjectRepository(Restaurant)
        private restaurantRepository: Repository<Restaurant>,
    ) { }

    async createClash(createClashDto: CreateClashDto, creator: User): Promise<Clash> {
        const { channelId, optionAId, optionBId, type } = createClashDto;

        const channel = await this.channelRepository.findOne({
            where: { id: channelId },
            relations: ['group', 'group.members', 'group.creator'],
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
                this.activitiesRepository.findOne({ where: { id: optionBId } })
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

        await clash.save();
        return clash;
    }

    async getVoteCount(getVoteDto: GetVoteDto, user: User) {
        const { clashId } = getVoteDto;
        const clash = await this.clashRepository.findOne({
            where: { id: clashId },
            relations: ['channel', 'channel.groupe', 'channel.groupe.creator', 'channel.groupe.members'],
        });

        if (!clash) {
            throw new NotFoundException('Clash not found');
        }

        const group = clash.channel.groupe;

        const isCreator = group.creator.id === user.id;
        const isMember = group.members.some(member => member.id === user.id);

        if (!isCreator && !isMember) {
            throw new ForbiddenException("You are not authorized to view votes for this clash.");
        }

        const votes = await this.voteRepository.find({
            where: { clash: { id: clashId } },
        });

        const optionACount = votes.filter(v => v.option === 'A').length;
        const optionBCount = votes.filter(v => v.option === 'B').length;

        return {
            optionA: optionACount,
            optionB: optionBCount,
            total: votes.length,
        };
    }

    async submitVote(voteDto: VoteDto, user: User): Promise<Vote> {
        const { clashId, option } = voteDto;

        const clash = await this.clashRepository.findOne({
            where: { id: clashId },
            relations: ['channel', 'channel.group', 'channel.group.members', 'channel.group.creator'],
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

        return await vote.save();
    }
}