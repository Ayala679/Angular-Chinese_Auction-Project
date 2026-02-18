export class CreatePurchase {
    gift_Id!: number;
    user_Id!: number;
    package_Id!: number;
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

