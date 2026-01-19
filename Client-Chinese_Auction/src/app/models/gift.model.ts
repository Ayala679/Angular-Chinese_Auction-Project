export class GiftDto {
    Name!: string;
    Description!: string;
    Details?: string;
    picture!: string;
    Value!: number;
    Donor_Id!: number;
    Category_Id!: number;
    isLottery: boolean = false;
    IsApproved: boolean = false;
}

export class GetGiftDto {
    Id!: number;
    Name!: string;
    Description!: string;
    Details?: string;
    picture!: string;
    Value!: number;
    Donor_Id!: number;
    Category_Name!: string;
    isLottery: boolean = false;
    IsApproved: boolean = false;
    Purchase_quantity!: number;
}

export class UpdateGiftDto {
    Purchase_quantity!: number;
}

export class ApproveGiftDto {
    Id!: number;
    IsApproved: boolean = false;
}