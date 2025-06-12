import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { GroupeService } from './groupe.service';
import { Groupe } from './groupe.entity';
import { Roles } from 'src/decorators/role.decorator';
import { AuthGuard } from 'src/guard/auth.guard';
import { GroupeCreateDto } from './dto/groupe-create.dto';
import { UserRequest } from 'src/interface/user-request.interface';
import { UserService } from 'src/user/user.service';
import { groupeUserDto } from './dto/groupe-user.dto';

@Controller('groupe')
export class GroupeController {
    constructor(private groupeService: GroupeService, private userService: UserService) { }

    @UseGuards(AuthGuard)
    @Roles(['user'])
    @Get()
    async getGroupeUser(@Req() request): Promise<Groupe[]> {
        const userRequest: UserRequest = request.user
        const user = await this.userService.findOne(userRequest.email)

        return this.groupeService.getGroupsByUser(user)
    }
    
    @UseGuards(AuthGuard)
    @Roles(['user'])
    @Post('create')
    async createGroupe(@Body() groupeCreateDto: GroupeCreateDto, @Req() request): Promise<Groupe> {
        const userRequest: UserRequest = request.user
        const user = await this.userService.findOne(userRequest.email)

        return this.groupeService.createGroupe(groupeCreateDto, user)
    }

    @UseGuards(AuthGuard)
    @Roles(['user'])
    @Post('add-user')
    async addUser(@Body() addUserDto: groupeUserDto, @Req() request): Promise<Groupe> {
        const userRequest: UserRequest = request.user
        const user = await this.userService.findOne(userRequest.email)

        return this.groupeService.addUser(addUserDto)
    }

    @UseGuards(AuthGuard)
    @Roles(['user'])
    @Post('remove-user')
    async removeUser(@Body() removeUserDto: groupeUserDto, @Req() request): Promise<Groupe> {
        const userRequest: UserRequest = request.user
        const user = await this.userService.findOne(userRequest.email)

        return this.groupeService.removeUser(removeUserDto, user)
    }
}
