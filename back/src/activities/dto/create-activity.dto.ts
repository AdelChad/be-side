import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateActivityDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    country: string

    @IsString()
    @IsNotEmpty()
    address: string

    @IsString()
    @IsNotEmpty()
    price: string

    @IsString()
    @IsNotEmpty()
    description: string

    @IsString()
    @IsNotEmpty()
    city: string

    @IsBoolean()
    isBook: boolean
}