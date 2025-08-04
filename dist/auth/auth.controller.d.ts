import { AuthService } from './auth.service';
import { LoginDto, PasswordResetRequestDto, PasswordResetDto, RefreshTokenDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(req: any): Promise<{
        message: string;
    }>;
    requestPasswordReset(dto: PasswordResetRequestDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: PasswordResetDto): Promise<{
        message: string;
        user: any;
    }>;
    refreshTokens(dto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
