export class CreatePackageDto {
    Name!: string;
    Description!: string;
    Cards_quantity!: number;
    Price!: number;
}

export class GetPackageDto {
    Id!: number;
    Name!: string;
    Description!: string;
    Cards_quantity!: number;
    Price!: number;
}