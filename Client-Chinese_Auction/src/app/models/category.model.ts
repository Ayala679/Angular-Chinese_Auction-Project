import { GiftDto } from './gift.model';

export class CategoryDto {
    Name!: string;
}

export class GetCategoryDto {
    Id!: number;
    Name!: string;
    Gifts: GiftDto[] = [];
}