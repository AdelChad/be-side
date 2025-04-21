import { IsNotEmpty, IsNumberString, IsString } from "class-validator";

export class UpdateActivityDto {
    @IsNumberString()
    @IsNotEmpty()
    idActivities: number

    @IsString()
    @IsNotEmpty()
    daytime: string

    @IsString()
    date?: string

}