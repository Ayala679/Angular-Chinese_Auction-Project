import { GiftDto } from './gift.model';

export class Category {
    name!: string;
    picture!: string;
}

export class GetCategory {
    id!: number;
    name!: string;
    picture!: string;
    gifts: GiftDto[] = [];
}