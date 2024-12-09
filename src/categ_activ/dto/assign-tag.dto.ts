import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class AssignTagDto {
    @IsArray()
    @IsNotEmpty()
    tagArray: number[];   
}