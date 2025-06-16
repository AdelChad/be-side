import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ClashService } from './clash.service';
import { AuthGuard } from 'src/guard/auth.guard';
import { VoteDto } from './dto/create-vote.dto';
import { User } from 'src/user/user.entity';
import { UserRequest } from 'src/interface/user-request.interface';
import { UserService } from 'src/user/user.service';
import { Vote } from 'src/vote/vote.entity';
import { Roles } from 'src/decorators/role.decorator';
import { CreateClashDto } from './dto/create-clash.dto';
import { Clash } from './clash.entity';
import { GetVoteDto } from './dto/get-vote.dto';

@Controller('clash')
export class ClashController {
    constructor(
        private clashService: ClashService,

        private userService: UserService
    ) { }

    @UseGuards(AuthGuard)
    @Roles(['user'])
    @Post('create')
    async createClash(@Body() createClashDto: CreateClashDto, @Req() request): Promise<Clash> {
        const userRequest: UserRequest = request.user
        const user = await this.userService.findOne(userRequest.email)

        return this.clashService.createClash(createClashDto, user);
    }

    @UseGuards(AuthGuard)
    @Roles(['user'])
    @Get('vote')
    async getVotes(@Body() getVoteDto: GetVoteDto, @Req() request){
        const userRequest: UserRequest = request.user
        const user = await this.userService.findOne(userRequest.email)

        return this.clashService.getVoteCount(getVoteDto, user);
    }

    @UseGuards(AuthGuard)
    @Roles(['user'])
    @Post('vote')
    async vote(@Body() voteDto: VoteDto, @Req() request): Promise<Vote> {
        const userRequest: UserRequest = request.user
        const user = await this.userService.findOne(userRequest.email)

        return this.clashService.submitVote(voteDto, user);
    }
}
