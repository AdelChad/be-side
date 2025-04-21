import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt'
import { UserCreateDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    findOne(email: string): Promise<User> {
        return this.userRepository.findOneBy({ email });
    }

    async create(createUserDto: UserCreateDto) {
        const { firstName, lastName, phoneNumber, email, password, city, country, dateofbirthday } = createUserDto
            
        const salt = await bcrypt.genSalt()

        const passwordHashed = await bcrypt.hash(password, salt)
        
        let user = new User()
        user.firstName = firstName;
        user.lastName = lastName;
        user.phoneNumber = phoneNumber;
        user.email = email;
        user.password = passwordHashed;
        user.city = city;
        user.country = country;
        user.dateofbirthday = new Date(dateofbirthday);

        return await this.userRepository.save(user)
    }

    async remove(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }
}
