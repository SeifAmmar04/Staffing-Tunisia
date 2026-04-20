import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { OffreModule } from './offres/offres.module';
import { ContactModule } from './contact/contact.module';
import { CandidaturesModule } from './candidatures/candidatures.module';
import { CvModule } from './cv/cv.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // ✅ charge le .env partout
    UsersModule,
    AuthModule,
    OffreModule,
    ContactModule,
    CandidaturesModule,
    CvModule,
    
  ],
})
export class AppModule {}