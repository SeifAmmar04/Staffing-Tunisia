import { Module } from '@nestjs/common';
import { OffreController } from './offres.controller';
import { OffreService } from './offres.service';

@Module({
  controllers: [OffreController],
  providers: [OffreService],
})
export class OffreModule {}