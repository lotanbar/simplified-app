export declare class LoginDto {
    email: string;
    password: string;
}
export declare class PasswordResetRequestDto {
    email: string;
}
export declare class PasswordResetDto {
    token: string;
    newPassword: string;
}
export declare class RefreshTokenDto {
    refreshToken: string;
}
