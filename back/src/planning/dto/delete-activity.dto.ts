import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { TimeSlot, TimeSlotRestau } from 'src/utils/enum';

export class DeleteActivityDto {
  @IsNumber()
  @IsNotEmpty()
  activityDayId: number;

  @IsNumber()
  @IsNotEmpty()
  activityId: number;

  @IsNotEmpty()
  @IsEnum({ 
    ...TimeSlot, 
    ...TimeSlotRestau 
  }, {
    message: 'Le champ time doit être un créneau horaire valide'
  })
  time: TimeSlot | TimeSlotRestau;
}