export class CreateDonor {
    email!: string;
    password!: string;
    firstName!: string;
    lastName!: string;
    phone?: string;
    companyName?: string;
    companyDescription?: string;
    companyPicture?: string;
    isPublish: boolean = false;
}

export class UserGetDonor {
    companyName?: string;
    companyDescription?: string;
    companyPicture?: string;
    isPublish: boolean = false;
}

export class ManagerGetDonor {
    id!: number;
    email!: string;
    firstName!: string;
    lastName!: string;
    phone?: string;
    companyName?: string;
    companyDescription?: string;
    companyPicture?: string;
    isPublish: boolean = false;
}