export class CreatePurchaseDto {
    Gift_Id!: number;
    User_Id!: number;
    Package_Id!: number;
}

export class GetPurchaseDto {
    Id!: number;
    Gift_Id!: number;
    Package_Id!: number;
    User_Id!: number;
    Unique_Package_Id!: string;
    Is_Won: boolean = false;
}

export class UpdatePurchaseDto {
    Is_Won: boolean = false;
}

// לצורך הטיפוס ב-GetUserDto
export class Purchase extends GetPurchaseDto {}