import {
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException,
    ForbiddenException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { SignInDto } from './dto/signIn.dto';
import { JwtService } from '@nestjs/jwt';
import { UserRequest } from 'src/interface/user-request.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    private loginAttempts = new Map<string, { attempts: number; lastAttempt: number }>();
    private MAX_ATTEMPTS = 5;
    private BLOCK_DURATION = 15 * 60 * 1000;

    constructor(
        private usersService: UserService,
        private jwtService: JwtService,
    ) {}

    async authentication(
        signInDto: SignInDto,
    ): Promise<{ access_token: string }> {
        const { email, pass } = signInDto;

        if (!email || !pass) {
            throw new HttpException(
                '__The Email or Password is missing',
                HttpStatus.BAD_REQUEST,
            );
        }

        const loginInfo = this.loginAttempts.get(email);
        const now = Date.now();

        if (loginInfo) {
            if (loginInfo.attempts >= this.MAX_ATTEMPTS && now - loginInfo.lastAttempt < this.BLOCK_DURATION) {
                const remaining = Math.ceil((this.BLOCK_DURATION - (now - loginInfo.lastAttempt)) / 1000,);
                throw new ForbiddenException(
                    `Too many failed attempts. Please try again in ${remaining} seconds.`,
                );
            }
        }

        const user = await this.usersService.findOne(email);

        const isPassword = await bcrypt.compare(pass, user.password);

        if (!isPassword) {
            if (loginInfo) {
                loginInfo.attempts += 1;
                loginInfo.lastAttempt = now;
            } else {
                this.loginAttempts.set(email, { attempts: 1, lastAttempt: now });
            }

            throw new UnauthorizedException('__Wrong password');
        }

        this.loginAttempts.delete(email);

        const payload: UserRequest = {
            id: user.id,
            email: user.email,
            role: user.role,
        };

        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    logout() {
        return { message: 'Déconnecté avec succès' };
    }
}