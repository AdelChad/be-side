import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { User } from "src/user/user.entity";

class UserMinimalDto {
    @IsNotEmpty()
    id: number;
  
    @IsNotEmpty()
    @IsString()
    firstName: string;
  
    @IsNotEmpty()
    @IsString()
    lastName: string;
  
    @IsNotEmpty()
    @IsString()
    email: string;
}

export class GroupeCreateDto {

    @IsString()
    @IsNotEmpty()
    groupeName: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UserMinimalDto)
    users: UserMinimalDto[];
}