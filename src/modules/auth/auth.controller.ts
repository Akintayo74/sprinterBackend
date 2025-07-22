import { Body, Controller, Post, Query, Req, Get, UseGuards, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { CompleteProfileDto } from './dto/complete-profile.dto';
import { LoginDto } from './dto/login.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto'; 
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Request } from 'express';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    console.log("Register dto:", dto); 
    return this.authService.register(dto.email, dto.password);
  }

  @Get('verify-email')
  verify(@Query('token') token: string) {
    return this.authService.verifyEmailToken(token);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Post('complete-profile')
  @UseGuards(JwtAuthGuard)
  async completeProfile(
      @Req() req: Request & { user?: { id: number } }, // explicitly type it
      @Body() dto: CompleteProfileDto,
    ) {
        if (!req.user) throw new UnauthorizedException();
        return this.authService.completeProfile(req.user.id, dto);
    }
  
    
    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getMe(@Req() req: Request & { user?: { id: number } }) {
        if (!req.user) throw new UnauthorizedException();
        const user = await this.authService.getUserProfile(req.user.id);
        return { user };
    }

    @Post('resend-verification')
    async resendVerification(@Body() dto: ResendVerificationDto) {
        return this.authService.resendVerification(dto.email);
    }
    
    @Post('forgot-password')
    async forgotPassword(@Body() dto: ForgotPasswordDto) {
        return this.authService.sendResetPasswordLink(dto.email);
    }
    
    @Post('reset-password')
    async resetPassword(@Body() dto: ResetPasswordDto) {
        return this.authService.resetPassword(dto.token, dto.newPassword);
    }


}
