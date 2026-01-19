import { GetPurchaseDto } from './purchase.model';

export enum Role {
    customer = 0,
    manager = 1
}

export class CreateUser {
    Email!: string;
    Password!: string;
    First_name!: string;
    Last_name!: string;
    Phone?: string;
}

export class GetUser {
    Id!: number;
    Email!: string;
    First_name!: string;
    Last_name!: string;
    Phone?: string;
    Role!: number; // מיוצג כ-Enum Role
    Purchases: GetPurchaseDto[] = [];
}