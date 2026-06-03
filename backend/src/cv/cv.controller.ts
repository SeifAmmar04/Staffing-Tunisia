import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFile, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CvService } from './cv.service';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('resume', {
    storage: memoryStorage(),
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(pdf|doc|docx)$/)) {
        return cb(new HttpException('Seuls PDF, DOC et DOCX sont acceptés', HttpStatus.BAD_REQUEST), false);
      }
      cb(null, true);
    },
    limits: { fileSize: 10 * 1024 * 1024 },
  }))
  async uploadCV(@UploadedFile() file: Express.Multer.File, @Body('user_id') userId: string) {
    if (!file) throw new HttpException('Aucun fichier fourni', HttpStatus.BAD_REQUEST);
    if (!userId) throw new HttpException('ID utilisateur requis', HttpStatus.BAD_REQUEST);

    const userIdNum = parseInt(userId);
    if (isNaN(userIdNum)) throw new HttpException('ID utilisateur invalide', HttpStatus.BAD_REQUEST);

    const url = await new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'staffing-tunisia/cvs', resource_type: 'raw' },
        (error, result) => error ? reject(error) : resolve(result!.secure_url)
      );
      Readable.from(file.buffer).pipe(uploadStream);
    });

    const cv = await this.cvService.saveUserCV(userIdNum, url, file.originalname);

    return {
      success: true,
      message: 'CV uploadé avec succès',
      resume_path: url,
      originalname: file.originalname,
      cv: cv,
    };
  }

  @Get('user/:userId')
  async getUserCV(@Param('userId') userId: string) {
    const userIdNum = parseInt(userId);
    if (isNaN(userIdNum)) throw new HttpException('ID utilisateur invalide', HttpStatus.BAD_REQUEST);
    return await this.cvService.getUserCV(userIdNum);
  }

@Delete('user/:userId')
  async deleteUserCV(@Param('userId') userId: string) {
    const userIdNum = parseInt(userId);
    if (isNaN(userIdNum)) throw new HttpException('ID utilisateur invalide', HttpStatus.BAD_REQUEST);
    await this.cvService.deleteUserCV(userIdNum);
    return { success: true, message: 'CV supprimé avec succès' };
  }
}
