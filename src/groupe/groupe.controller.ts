import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { GroupeService } from './groupe.service';
import { Groupe } from './groupe.entity';
import { Roles } from 'src/decorators/role.decorator';
import { AuthGuard } from 'src/guard/auth.guard';
import { GroupeCreateDto } from './dto/groupe-create.dto';
import { UserRequest } from 'src/interface/user-request.interface';
import { UserService } from 'src/user/user.service';

@Controller('groupe')
export class GroupeController {
    constructor(private groupeService: GroupeService, private userService: UserService) { }

    @UseGuards(AuthGuard)
    @Roles(['user'])
    @Post('create')
    async createGroupe(@Body() groupeCreateDto: GroupeCreateDto, @Req() request): Promise<Groupe> {
        const userRequest: UserRequest = request.user
        const user = await this.userService.findOne(userRequest.email)

        return this.groupeService.createGroupe(groupeCreateDto, user)
    }
}
