import { Controller, Get, Post, Patch, Delete, Param, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CandidaturesService } from './candidatures.service';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

@Controller('candidatures')
export class CandidaturesController {
  constructor(private readonly candidaturesService: CandidaturesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('resume', {
    storage: memoryStorage(),
    fileFilter: (req, file, cb) => {
      const allowed = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Format non autorisé.'), false);
    },
    limits: { fileSize: 3 * 1024 * 1024 },
  }))
  async create(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
    let resume_path = body.existing_resume_path ?? null;
    if (file) {
      const url = await new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'staffing-tunisia/resumes', resource_type: 'raw' },
          (error, result) => error ? reject(error) : resolve(result!.secure_url)
        );
        Readable.from(file.buffer).pipe(uploadStream);
      });
      resume_path = url;
    }
    return this.candidaturesService.create(
      body.job_id,
      body.applicant_id ?? null,
      body.first_name,
      body.last_name,
      body.email,
      body.phone,
      resume_path,
      body.message ?? null,
    );
  }

  @Get()
  findAll() {
    return this.candidaturesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.candidaturesService.findById(Number(id));
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.candidaturesService.updateStatus(Number(id), body.status);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.candidaturesService.delete(Number(id));
  }
}
