import { GetUserDto } from './user.model';

export class LoginRequestDto {
    Email!: string;
    Password!: string;
}

export class LoginResponseDto {
    Token!: string;
    TokenType: string = "Bearer";
    ExpiresInMinutes!: number;
    User: GetUserDto = new GetUserDto();
}