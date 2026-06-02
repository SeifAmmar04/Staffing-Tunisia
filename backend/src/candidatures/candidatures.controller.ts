import { Controller, Get, Post, Patch, Delete, Param, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CandidaturesService } from './candidatures.service';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { memoryStorage } from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

@Controller('applications')
export class CandidaturesController {
  constructor(private readonly service: CandidaturesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('resume', {
  storage: memoryStorage(), // ← AJOUTE CETTE LIGNE
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Format non autorisé.'), false);
    }
  },
  limits: { fileSize: 3 * 1024 * 1024 },
}))
  async create(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
    let resume_path = body.existing_resume_path ?? null;

    if (file) {
      // Upload vers Cloudinary
      const url = await new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'staffing-tunisia/resumes', resource_type: 'raw' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        Readable.from(file.buffer).pipe(uploadStream);
      });
      resume_path = url;
    }

    return this.service.create(
      +body.job_id,
      body.applicant_id ? +body.applicant_id : null,
      body.first_name,
      body.last_name,
      body.email,
      body.phone,
      resume_path,
      body.message ?? null,
    );
  }

  @Get()
  findAll() { return this.service.findAll(); }

  @Get(':id')
  findById(@Param('id') id: string) { return this.service.findById(+id); }

  @Patch(':id')
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.service.updateStatus(+id, body.status);
  }

  @Delete(':id')
  delete(@Param('id') id: string) { return this.service.delete(+id); }
}
