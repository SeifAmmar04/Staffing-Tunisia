import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
@Post('google')
loginWithGoogle(@Body() body: any) {
  return this.authService.loginWithGoogle(body);
}
  @Post('login')
  login(@Body() body: any) {
    return this.authService.login(body);
  }
}