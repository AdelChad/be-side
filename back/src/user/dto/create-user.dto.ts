import { Type } from "class-transformer";
import { IsDate, IsEmail, IsNotEmpty, IsOptional, IsString, } from "class-validator";

export class UserCreateDto {

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsString()
    phoneNumber: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    dateofbirthday: Date;

    @IsString()
    city: string;

    @IsString()
    country: string;

    @IsString()
    @IsOptional()
    profilePicture?: string;

}