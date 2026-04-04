import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { OffreModule } from './offres/offres.module';
import { ContactModule } from './contact/contact.module';
@Module({
  imports: [UsersModule, AuthModule, OffreModule, ContactModule], // ← AuthModule ajouté
})

export class AppModule {}