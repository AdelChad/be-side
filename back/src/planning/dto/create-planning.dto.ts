import { Type } from "class-transformer";
import { IsArray, IsDate, IsEnum, IsNotEmpty, IsString, ValidateNested, } from "class-validator";
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

export class PlanningCreateDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    date: Date;

    @IsArray()
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => ActivitiMinimal)
    activities: ActivitiMinimal[];;

    @IsArray()
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => RestauMinimal)
    restaurants: RestauMinimal[];;

    groupeId: number;
}