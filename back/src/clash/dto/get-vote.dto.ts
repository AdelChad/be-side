import { IsNumber } from "class-validator";

export class GetVoteDto {
    @IsNumber()
    clashId: number;
}