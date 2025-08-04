import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { ShortLinksService } from '../short-links/short-links.service';
import { TokenType } from '../common/enums';
export interface TokenPayload {
    sub: string;
    email: string;
    role: string;
    type: TokenType;
    iat?: number;
    exp?: number;
}
export declare class AuthService {
    private usersService;
    private jwtService;
    private configService;
    private shortLinksService;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService, shortLinksService: ShortLinksService);
    login(email: string, password: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string): Promise<void>;
    requestPasswordReset(email: string): Promise<void>;
    resetPassword(token: string, newPassword: string): Promise<any>;
    refreshTokens(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    private signToken;
}
