import { IsIn, IsOptional, IsString } from 'class-validator';

export class SearchActivityRestaurantDto {
    @IsString()
    @IsOptional()
    search: string;

    @IsString()
    @IsOptional()
    city: string;

    @IsOptional()
    tags: string[];

    @IsString()
    @IsOptional()
    @IsIn(['restaurant', 'activity'])
    type: string;
}
