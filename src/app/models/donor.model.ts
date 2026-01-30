export class CreateDonorDto {
    Email!: string;
    Password!: string;
    First_name!: string;
    Last_name!: string;
    Phone?: string;
    Company_name?: string;
    Company_description?: string;
    Company_picture?: string;
    Is_publish: boolean = false;
}

export class UserGetDonorDto {
    Company_name?: string;
    Company_description?: string;
    Company_picture?: string;
    Is_publish: boolean = false;
}

export class ManagerGetDonorDto {
    Id!: number;
    Email!: string;
    First_name!: string;
    Last_name!: string;
    Phone?: string;
    Company_name?: string;
    Company_description?: string;
    Company_picture?: string;
    Is_publish: boolean = false;
}