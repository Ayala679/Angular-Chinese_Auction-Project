import { GiftDto } from './gift.model';

export class Category {
    Name!: string;
    Picture!: string;
}

export class GetCategory {
    Id!: number;
    Name!: string;
    Picture!: string;
    Gifts: GiftDto[] = [];
}