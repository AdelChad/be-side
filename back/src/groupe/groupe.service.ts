import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Groupe } from './groupe.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupeCreateDto } from './dto/groupe-create.dto';
import { User } from 'src/user/user.entity';
import { Channel } from 'src/channel/channel.entity';

@Injectable()
export class GroupeService {
    constructor(
        @InjectRepository(Groupe)
        public groupRepository: Repository<Groupe>,
        @InjectRepository(User)
        public userRepository: Repository<User>
    ){}

    async createGroupe(groupeCreateDto: GroupeCreateDto, user: User): Promise<Groupe | undefined>{

        const { groupeName, users } = groupeCreateDto

        let groupe = new Groupe()
        let channel = new Channel()

        groupe.creator = user
        groupe.groupeName = groupeName;
        groupe.members = [];

        for (const userDto of users) {
            const user = await this.userRepository.findOneBy({ id: userDto.id });
            if (user) {
                groupe.members.push(user);
            }
        }
        
        await groupe.save();

        channel.groupe = groupe
        channel.name = groupe.groupeName

        await channel.save();

        return groupe
    }

}
