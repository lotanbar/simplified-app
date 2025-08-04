"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const users_service_1 = require("../users/users.service");
const short_links_service_1 = require("../short-links/short-links.service");
const bcrypt_1 = require("../utils/bcrypt");
const enums_1 = require("../common/enums");
let AuthService = class AuthService {
    constructor(usersService, jwtService, configService, shortLinksService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.shortLinksService = shortLinksService;
    }
    async login(email, password) {
        if (!email || !password) {
            throw new common_1.BadRequestException('Email and password are required');
        }
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await (0, bcrypt_1.validatePassword)(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = {
            sub: user._id.toString(),
            email: user.email,
            role: user.role,
            type: enums_1.TokenType.ACCESS,
        };
        const accessToken = await this.signToken(payload, '15m');
        const refreshToken = await this.signToken({ ...payload, type: enums_1.TokenType.REFRESH }, '7d');
        const hashedRefreshToken = await (0, bcrypt_1.hashPassword)(refreshToken);
        await this.usersService.updateRefreshToken(user._id.toString(), hashedRefreshToken);
        return { accessToken, refreshToken };
    }
    async logout(userId) {
        await this.usersService.updateRefreshToken(userId, null);
    }
    async requestPasswordReset(email) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            return;
        }
        const resetToken = await this.signToken({
            sub: user._id.toString(),
            email: user.email,
            role: user.role,
            type: enums_1.TokenType.PASSWORD,
        }, '1h');
        const resetUrl = `${this.configService.get('CLIENT_BASE_URL')}/reset-password?token=${resetToken}`;
        const shortCode = await this.shortLinksService.create(resetUrl, 'password');
        const shortUrl = `${this.configService.get('BACKEND_BASE_URL')}/r/${shortCode}`;
        console.log('Password reset URL:', shortUrl);
    }
    async resetPassword(token, newPassword) {
        let payload;
        try {
            payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get('JWT_SECRET'),
            });
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired reset token');
        }
        if (payload.type !== enums_1.TokenType.PASSWORD) {
            throw new common_1.UnauthorizedException('Invalid token type');
        }
        const user = await this.usersService.updatePassword(payload.sub, newPassword);
        const { password, refreshToken, ...safeUser } = user.toObject();
        return safeUser;
    }
    async refreshTokens(refreshToken) {
        let payload;
        try {
            payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.configService.get('JWT_SECRET'),
            });
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        if (payload.type !== enums_1.TokenType.REFRESH) {
            throw new common_1.UnauthorizedException('Invalid token type');
        }
        const user = await this.usersService.findByEmail(payload.email);
        if (!user || !user.refreshToken) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const isValidRefreshToken = await (0, bcrypt_1.validatePassword)(refreshToken, user.refreshToken);
        if (!isValidRefreshToken) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const newPayload = {
            sub: user._id.toString(),
            email: user.email,
            role: user.role,
            type: enums_1.TokenType.ACCESS,
        };
        const newAccessToken = await this.signToken(newPayload, '15m');
        const newRefreshToken = await this.signToken({ ...newPayload, type: enums_1.TokenType.REFRESH }, '7d');
        const hashedNewRefreshToken = await (0, bcrypt_1.hashPassword)(newRefreshToken);
        await this.usersService.updateRefreshToken(user._id.toString(), hashedNewRefreshToken);
        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }
    async signToken(payload, expiresIn) {
        return this.jwtService.signAsync(payload, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn,
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService,
        short_links_service_1.ShortLinksService])
], AuthService);
//# sourceMappingURL=auth.service.js.map