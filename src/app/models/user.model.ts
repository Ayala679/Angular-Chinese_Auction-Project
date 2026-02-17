import { GetPurchase } from './purchase.model';

export enum Role {
    customer = 0,
    manager = 1
}

export class CreateUser {
    email!: string;
    password!: string;
    first_name!: string;
    last_name!: string;
    phone?: string;
}

export class GetUser {
    id!: number;
    email!: string;
    first_name!: string;
    last_name!: string;
    phone?: string;
    role!: number; 
    purchases: GetPurchase[] = [];
}