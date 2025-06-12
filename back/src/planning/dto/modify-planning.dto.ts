import { Type } from "class-transformer";
import { IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber, ValidateNested, } from "class-validator";
import { TimeSlot, TimeSlotRestau } from "src/utils/enum";

class ActivitiMinimal {
    @IsNotEmpty()
    id: number;
  
    @IsEnum(TimeSlot)
    time: TimeSlot;
}

class RestauMinimal {
    @IsNotEmpty()
    id: number;
  
    @IsEnum(TimeSlotRestau)
    time: TimeSlotRestau;
}

export class PlanningUpdateDto {

    @IsNotEmpty()
    id: number;

    @Type(() => Date)
    @IsDate()
    date: Date;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ActivitiMinimal)
    activities: ActivitiMinimal[];;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RestauMinimal)
    restaurants: RestauMinimal[];;

    groupeId: number;
}