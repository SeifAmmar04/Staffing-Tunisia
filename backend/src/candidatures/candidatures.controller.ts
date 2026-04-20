import { Controller, Get, Post, Patch, Delete, Param, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CandidaturesService } from './candidatures.service';

@Controller('applications')
export class CandidaturesController {
  constructor(private readonly service: CandidaturesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('resume', {
    storage: diskStorage({
      destination: './uploads/resumes',
      filename: (req, file, cb) => {
        const unique = Date.now() + '-' + file.originalname;
        cb(null, unique);
      },
    }),
    fileFilter: (req, file, cb) => {
      const allowed = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      if (allowed.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Format non autorisé. Veuillez uploader un CV en PDF ou Word.'), false);
      }
    },
    limits: { fileSize: 3 * 1024 * 1024 },
  }))
  async create(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
    const resume_path = file?.path ?? body.existing_resume_path ?? null;
    return this.service.create(
      +body.job_id,
      body.applicant_id ? +body.applicant_id : null,
      body.first_name,
      body.last_name,
      body.email,
      body.phone,
      resume_path,
      body.message ?? null,   // ← AJOUTÉ
    );
  }

  @Get()
  findAll() { return this.service.findAll(); }

  @Get(':id')
  findById(@Param('id') id: string) { return this.service.findById(+id); }

  // ← PATCH au lieu de PUT, et route /:id direct (pas /:id/status)
  @Patch(':id')
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.service.updateStatus(+id, body.status);
  }

  @Delete(':id')
  delete(@Param('id') id: string) { return this.service.delete(+id); }
}