import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { UserCreateDto } from './dto/create-user.dto';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(email: string): Promise<User | undefined>{
    const user  = await  this.userRepository.findOne({where: {email}})

    if(user){
        return user
    }
    
    throw new HttpException(`__The user with email: ${email} was not found`, HttpStatus.NOT_FOUND)
}

  async create(createUserDto: UserCreateDto) {
    const {
      firstName,
      lastName,
      phoneNumber,
      email,
      password,
      city,
      country,
      dateofbirthday,
      profilePicture,
    } = createUserDto;

    const salt = await bcrypt.genSalt();

    const passwordHashed = await bcrypt.hash(password, salt);

    const user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.phoneNumber = phoneNumber;
    user.email = email;
    user.password = passwordHashed;
    user.city = city;
    user.country = country;
    user.dateofbirthday = new Date(dateofbirthday);
    user.profilePicture = profilePicture || null;

    return await this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async updateProfilePicture(id: number, filename: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
  
    if (user.profilePicture && typeof user.profilePicture === 'string') {
      const oldPath = path.join(
        process.cwd(),
        'uploads/profile-pictures',
        user.profilePicture,
      );
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }
  
    user.profilePicture = filename;
    return this.userRepository.save(user);
  }

  async deleteProfilePicture(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    if (user.profilePicture) {
      const oldPath = path.join(process.cwd(), 'uploads', 'profile-pictures', user.profilePicture);

      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    user.profilePicture = null;
    return this.userRepository.save(user);
  }
}
