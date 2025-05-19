import { IsNotEmpty, IsString } from "class-validator";

export class SearchActivityRestaurantDto {
    @IsString()
    @IsNotEmpty()
    search: string

    @IsString()
    city: string

    @IsString()
    type: string;
}