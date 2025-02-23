import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UserCreateDto } from './dto/create-user.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { Roles } from 'src/decorators/role.decorator';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }

    @UseGuards(AuthGuard)
    @Roles(['user'])
    @Get()
    findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Get(':email')
    findOne(@Param('email') email: string): Promise<User> {
        return this.userService.findOne(email);
    }

    @Post()
    create(@Body() CreateUserDto: UserCreateDto): Promise<User> {
        return this.userService.create(CreateUserDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string): Promise<void> {
        return this.userService.remove(+id);
    }
}
