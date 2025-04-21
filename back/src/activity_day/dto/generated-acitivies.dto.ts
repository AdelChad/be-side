import { IsNotEmpty } from "class-validator";

export class GeneratedActivitiesDto {

    @IsNotEmpty()
    localisation: string;

    @IsNotEmpty()
    accompanied: string;

    @IsNotEmpty()
    inside: boolean;

    @IsNotEmpty()
    outside: boolean;

    @IsNotEmpty()
    hobbies: string;

}