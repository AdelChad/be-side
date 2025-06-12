import { Type } from "class-transformer";
import { IsDate, IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MinLength, } from "class-validator";

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
    @MinLength(12, { message: 'Password must be at least 12 characters long' })
    @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/, {
        message:
            'Password must contain at least one uppercase letter, one number, and one special character',
    })
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