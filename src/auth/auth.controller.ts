import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';
import { LoginDto, PasswordResetRequestDto, PasswordResetDto, RefreshTokenDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req) {
    await this.authService.logout(req.user.sub);
    return { message: 'Logged out successfully' };
  }

  @Public()
  @Post('password-reset-request')
  async requestPasswordReset(@Body() dto: PasswordResetRequestDto) {
    await this.authService.requestPasswordReset(dto.email);
    return { message: 'Password reset link sent if email exists' };
  }

  @Public()
  @Post('password-reset')
  async resetPassword(@Body() dto: PasswordResetDto) {
    const user = await this.authService.resetPassword(dto.token, dto.newPassword);
    return { message: 'Password reset successfully', user };
  }

  @Public()
  @Post('refresh')
  async refreshTokens(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshTokens(dto.refreshToken);
  }
}