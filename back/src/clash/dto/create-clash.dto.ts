import { IsIn, IsNumber } from "class-validator";

export class CreateClashDto {
    @IsNumber()
    channelId: number;

    @IsNumber()
    optionAId: number;

    @IsNumber()
    optionBId: number;

    @IsIn(['activity', 'restaurant'])
    type: 'activity' | 'restaurant';
}