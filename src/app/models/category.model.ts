import { GiftDto } from './gift.model';

export class CategoryDto {
    Name!: string;
    Picture!: string;
}

export class GetCategoryDto {
    Id!: number;
    Name!: string;
    Picture!: string;
    Gifts: GiftDto[] = [];
}