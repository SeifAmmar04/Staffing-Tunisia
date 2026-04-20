import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { CandidaturesController } from './candidatures.controller';
import { CandidaturesService } from './candidatures.service';

@Module({
  imports: [MulterModule.register({ dest: './uploads/resumes' })],
  controllers: [CandidaturesController],
  providers: [CandidaturesService],
})
export class CandidaturesModule {}