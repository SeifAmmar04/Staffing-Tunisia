// cv.module.ts
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { CvController } from './cv.controller';
import { CvService } from './cv.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads/cvs',
    }),
  ],
  controllers: [CvController],
  providers: [CvService],
  exports: [CvService],
})
export class CvModule {}