import { IsNotEmpty, IsNumber, } from "class-validator";
export class PlanningShareDto {

    @IsNotEmpty()
    @IsNumber()
    planningId: number;
    
    @IsNotEmpty()
    @IsNumber()
    groupId: number;
}