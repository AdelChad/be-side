import { IsIn, IsNotEmpty } from 'class-validator';

export class VoteDto {
    @IsNotEmpty()
    clashId: number;

    @IsIn(['A', 'B'])
    option: 'A' | 'B';
}