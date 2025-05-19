import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Groupe } from './groupe.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupeCreateDto } from './dto/groupe-create.dto';
import { User } from 'src/user/user.entity';
import { Channel } from 'src/channel/channel.entity';
import { groupeUserDto } from './dto/groupe-user.dto';

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

    async addUser(addUserDto: groupeUserDto): Promise<Groupe | undefined> {
        const { groupeId, users } = addUserDto

        const groupe = await this.groupRepository.findOne({
            where: { id: groupeId },
            relations: ['members'],
        });
    
        if (!groupe) return;
    
        const currentMemberIds = new Set(groupe.members.map(member => member.id));
    
        for (const user of users) {
            if (!currentMemberIds.has(user.id)) {
                const userFind = await this.userRepository.findOne({
                    where: { id: user.id },
                });
                groupe.members.push(userFind);
            }
        }
    
        await groupe.save();
    
        return groupe;
    }

    async removeUser(removeUserDto: groupeUserDto, user: User): Promise<Groupe | undefined>{

        const { groupeId, users } = removeUserDto

        const groupe = await this.groupRepository.findOne({
            where: { id: groupeId },
            relations: ['members'],
        });
    
        if (!groupe) return;
    
        groupe.members = groupe.members.filter(
            member => !users.some(userToRemove => userToRemove.id === member.id)
        );
    
        await groupe.save();
    
        return groupe;
    }

}
