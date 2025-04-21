import { IsArray, IsDateString, IsNotEmpty, IsString } from "class-validator";

export class GenerateActivitiesPos {
    @IsString()
    @IsNotEmpty()
    search: String

    @IsString()
    city: string

    @IsString()
    latitude: number;

    @IsString()
    longitude: number;
}