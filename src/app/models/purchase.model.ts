export class CreatePurchase {
    Gift_Id!: number;
    User_Id!: number;
    Package_Id!: number;
}

export class GetPurchase {
    Id!: number;
    Gift_Id!: number;
    Package_Id!: number;
    User_Id!: number;
    Unique_Package_Id!: string;
    Is_Won: boolean = false;
}

export class UpdatePurchase {
    Is_Won: boolean = false;
}

