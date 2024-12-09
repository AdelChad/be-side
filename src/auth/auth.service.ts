import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { SignInDto } from './dto/signIn.dto';
import { JwtService } from '@nestjs/jwt';
import { UserRequest } from 'src/interface/user-request.interface';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService
        ){}

    async authentication(signInDto: SignInDto): Promise<{ access_token: string }>{

        const { email, pass } = signInDto;
        
        if(email == undefined || pass == undefined){
            throw new HttpException('__The Email or Password is missing', HttpStatus.BAD_REQUEST)
        }

        const user = await this.usersService.findOne(email);
        const isPassword = await bcrypt.compare(pass, user.password)
        
        if(!isPassword){
            throw new UnauthorizedException('__Wrong password')
        }
        
        const payload: UserRequest = { id: user.id, email: user.email, role: user.role }

        return {
            access_token: await this.jwtService.signAsync(payload)
        }
    }
}
