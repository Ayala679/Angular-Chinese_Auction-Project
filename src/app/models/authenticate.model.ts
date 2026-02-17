import { GetUser } from './user.model';

export class LoginRequest {
    email!: string;
    password!: string;
}

export class LoginResponse {
    token!: string;
    tokenType: string = "Bearer";
    expiresInMinutes!: number;
    user: GetUser = new GetUser();
}