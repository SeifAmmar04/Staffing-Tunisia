import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // ✅ GET tous les candidats
  @Get()
  async getAllCandidates() {
    return await this.usersService.findAllCandidates();
  }

  // ✅ POST créer un utilisateur (inscription)
  @Post()
  async createUser(@Body() data: any) {
    return await this.usersService.create(data);
  }

  // ✅ POST vérifier si email existe
  @Post('check-email')
  async checkEmail(@Body() body: { email: string }) {
    return await this.usersService.checkEmail(body.email);
  }

  // ✅ GET par email (Google OAuth)
  @Get('by-email/:email')
  async findByEmail(@Param('email') email: string) {
    return await this.usersService.findByEmail(email);
  }

  // ✅ GET par ID — EN DERNIER
  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.usersService.findById(parseInt(id));
  }

  // ✅ PATCH modifier profil
  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() data: any) {
    return await this.usersService.update(parseInt(id), data);
  }

  // ✅ PATCH changer mot de passe
  @Patch(':id/password')
  async changePassword(
    @Param('id') id: string,
    @Body() body: { currentPassword: string; newPassword: string }
  ) {
    return await this.usersService.changePassword(
      parseInt(id),
      body.currentPassword,
      body.newPassword
    );
  }

  // ✅ DELETE supprimer utilisateur
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return await this.usersService.delete(parseInt(id));
  }
}