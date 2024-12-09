import { CanActivate,ExecutionContext,Injectable, UnauthorizedException,} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../constantes/constantes';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enum/role.enum';
import { UserRequest } from 'src/interface/user-request.interface';

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private jwtService: JwtService, private reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean>  {

        const request: Request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {secret: jwtConstants.secret});
            
            request['user'] = payload;
        
        } catch {
            throw new UnauthorizedException();
        }

        const roles = this.reflector.get(Roles, context.getHandler());

        if( !roles ){
            return true;
        }
        const user: UserRequest = request['user'];

        return this.matchRoles(roles, user.role);
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];

        return type === 'Bearer' ? token : undefined;
    }

    private  matchRoles(roles: string[], userRole: string) : boolean{

        if( userRole == Role.Admin ){
            return true
        }

        for( const role of roles ){
            if(role == userRole){
                return true
            }
        }
        
        throw new UnauthorizedException();
    }
}