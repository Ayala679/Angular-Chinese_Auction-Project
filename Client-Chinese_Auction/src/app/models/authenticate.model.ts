import { GetUser } from './user.model';

export class LoginRequestDto {
    Email!: string;
    Password!: string;
}

export class LoginResponse {
    Token!: string;
    TokenType: string = "Bearer";
    ExpiresInMinutes!: number;
    User: GetUser = new GetUser();
}