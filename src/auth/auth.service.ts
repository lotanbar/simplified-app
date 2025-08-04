import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { ShortLinksService } from '../short-links/short-links.service';
import { validatePassword, hashPassword } from '../utils/bcrypt';
import { TokenType } from '../common/enums';

export interface TokenPayload {
  sub: string;
  email: string;
  role: string;
  type: TokenType;
  iat?: number;
  exp?: number;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private shortLinksService: ShortLinksService,
  ) {}

  async login(email: string, password: string) {
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await validatePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }


    const payload: TokenPayload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      type: TokenType.ACCESS,
    };

    const accessToken = await this.signToken(payload, '15m');
    const refreshToken = await this.signToken(
      { ...payload, type: TokenType.REFRESH },
      '7d'
    );

    // Store hashed refresh token
    const hashedRefreshToken = await hashPassword(refreshToken);
    await this.usersService.updateRefreshToken(user._id.toString(), hashedRefreshToken);

    return { accessToken, refreshToken };
  }

  async logout(userId: string): Promise<void> {
    await this.usersService.updateRefreshToken(userId, null);
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return; // Don't reveal if user exists
    }

    const resetToken = await this.signToken(
      {
        sub: user._id.toString(),
        email: user.email,
        role: user.role,
        type: TokenType.PASSWORD,
      },
      '1h'
    );

    const resetUrl = `${this.configService.get('CLIENT_BASE_URL')}/reset-password?token=${resetToken}`;
    const shortCode = await this.shortLinksService.create(resetUrl, 'password');
    const shortUrl = `${this.configService.get('BACKEND_BASE_URL')}/r/${shortCode}`;

    // TODO: Send email with shortUrl
    console.log('Password reset URL:', shortUrl);
  }

  async resetPassword(token: string, newPassword: string) {
    let payload: TokenPayload;

    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    if (payload.type !== TokenType.PASSWORD) {
      throw new UnauthorizedException('Invalid token type');
    }

    const user = await this.usersService.updatePassword(payload.sub, newPassword);
    
    // Return user without sensitive data
    const { password, refreshToken, ...safeUser } = user.toObject();
    return safeUser;
  }

  async refreshTokens(refreshToken: string) {
    let payload: TokenPayload;

    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('JWT_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (payload.type !== TokenType.REFRESH) {
      throw new UnauthorizedException('Invalid token type');
    }

    const user = await this.usersService.findByEmail(payload.email);
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const isValidRefreshToken = await validatePassword(refreshToken, user.refreshToken);
    if (!isValidRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const newPayload: TokenPayload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      type: TokenType.ACCESS,
    };

    const newAccessToken = await this.signToken(newPayload, '15m');
    const newRefreshToken = await this.signToken(
      { ...newPayload, type: TokenType.REFRESH },
      '7d'
    );

    // Update stored refresh token
    const hashedNewRefreshToken = await hashPassword(newRefreshToken);
    await this.usersService.updateRefreshToken(user._id.toString(), hashedNewRefreshToken);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  private async signToken(payload: TokenPayload, expiresIn: string): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn,
    });
  }
}