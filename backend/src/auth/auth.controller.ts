import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any) {
    return await this.authService.login(body);
  }

  @Post('google')
  async loginWithGoogle(@Body() body: any) {
    return await this.authService.loginWithGoogle(body);
  }

  // ✅ Envoie le lien de reset par email
  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    return await this.authService.forgotPassword(body.email);
  }

  // ✅ Réinitialise le mot de passe avec le token
  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    return await this.authService.resetPassword(body.token, body.newPassword);
  }
}