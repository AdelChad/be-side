import { IsNotEmpty, IsString } from "class-validator";

export class UpdateActivityDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    address: string

}