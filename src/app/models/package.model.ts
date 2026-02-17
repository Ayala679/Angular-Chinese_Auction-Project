export class CreatePackageDto {
    name!: string;
    description!: string;
    cardsQuantity!: number;
    price!: number;
}

export class GetPackageDto {
    id!: number;
    name!: string;
    description!: string;
    cardsQuantity!: number;
    price!: number;
}