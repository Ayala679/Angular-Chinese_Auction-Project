export class CreatePurchase {
    giftId!: number;
    userId!: number;
    packageId!: number;
}

export class GetPurchase {
    id!: number;
    giftId!: number;
    packageId!: number;
    userId!: number;
    uniquePackageId!: string;
    isWon: boolean = false;
}

export class UpdatePurchase {
    isWon: boolean = false;
}

