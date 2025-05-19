import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";

class UserMinimalDto {
    @IsNotEmpty()
    id: number;
  
    @IsNotEmpty()
    @IsString()
    email: string;
}

export class groupeUserDto {

    @IsNumber()
    @IsNotEmpty()
    groupeId: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UserMinimalDto)
    users: UserMinimalDto[];
}