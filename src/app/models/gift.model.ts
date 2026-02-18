export class GiftDto {
    name!: string;
    description!: string;
    details?: string;
    picture!: string;
    value!: number;
    donorId!: number;
    categoryId!: number;
    isLottery: boolean = false;
}

export class GetGiftDto {
    id!: number;
    name!: string;
    description!: string;
    details?: string;
    picture!: string;
    value!: number;
    donorId!: number;
    categoryId!: string;
    isLottery: boolean = false;
    purchaseQuantity!: number;
}

export class UpdateGiftDto {
    purchaseQuantity!: number;
}

