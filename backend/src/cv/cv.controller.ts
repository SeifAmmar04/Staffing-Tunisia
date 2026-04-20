// cv.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { CvService } from './cv.service';
import { unlink, access } from 'fs/promises';

@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  // ✅ Upload CV
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('resume', {
      storage: diskStorage({
        destination: './uploads/cvs',
        filename: (req, file, callback) => {
          const userId = req.body.user_id;
          const fileExtension = extname(file.originalname);
          const fileName = `cv_user_${userId}_${Date.now()}${fileExtension}`;
          callback(null, fileName);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(pdf|doc|docx)$/)) {
          return callback(
            new HttpException(
              'Seuls les fichiers PDF, DOC et DOCX sont acceptés',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max
      },
    }),
  )
  async uploadCV(
    @UploadedFile() file: Express.Multer.File,
    @Body('user_id') userId: string,
  ) {
    if (!file) {
      throw new HttpException('Aucun fichier fourni', HttpStatus.BAD_REQUEST);
    }

    if (!userId) {
      throw new HttpException('ID utilisateur requis', HttpStatus.BAD_REQUEST);
    }

    // ✅ Validation de l'ID utilisateur
    const userIdNum = parseInt(userId);
    if (isNaN(userIdNum)) {
      // Supprimer le fichier uploadé si l'ID est invalide
      await this.safeDeleteFile(file.path);
      throw new HttpException('ID utilisateur invalide', HttpStatus.BAD_REQUEST);
    }

    try {
      // ✅ Ordre sécurisé : sauvegarder d'abord en DB, supprimer l'ancien ensuite
      const existingCV = await this.cvService.getUserCV(userIdNum);

      // 1. Sauvegarder le nouveau CV en DB
      const cv = await this.cvService.saveUserCV(
        userIdNum,
        file.path,
        file.originalname,
      );

      // 2. Supprimer l'ancien fichier APRÈS succès DB
      if (existingCV && existingCV.cv_path) {
        const oldFilePath = join(process.cwd(), existingCV.cv_path);
        await this.safeDeleteFile(oldFilePath);
      }

      return {
        success: true,
        message: 'CV uploadé avec succès',
        resume_path: file.path,
        originalname: file.originalname,
        cv: cv,
      };
    } catch (error) {
      // Supprimer le nouveau fichier en cas d'erreur DB
      await this.safeDeleteFile(file.path);
      throw new HttpException(
        'Erreur lors de la sauvegarde du CV',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ✅ Récupérer le CV d'un utilisateur
  @Get('user/:userId')
  async getUserCV(@Param('userId') userId: string) {
    const userIdNum = parseInt(userId);
    if (isNaN(userIdNum)) {
      throw new HttpException('ID utilisateur invalide', HttpStatus.BAD_REQUEST);
    }

    const cv = await this.cvService.getUserCV(userIdNum);
    return cv;
  }

  // ✅ Supprimer le CV d'un utilisateur
  @Delete('user/:userId')
  async deleteUserCV(@Param('userId') userId: string) {
    const userIdNum = parseInt(userId);
    if (isNaN(userIdNum)) {
      throw new HttpException('ID utilisateur invalide', HttpStatus.BAD_REQUEST);
    }

    try {
      // Récupérer et supprimer le fichier physique
      const cv = await this.cvService.getUserCV(userIdNum);
      if (cv && cv.cv_path) {
        const fullPath = join(process.cwd(), cv.cv_path);
        await this.safeDeleteFile(fullPath);
      }

      // Supprimer de la DB
      await this.cvService.deleteUserCV(userIdNum);

      return { success: true, message: 'CV supprimé avec succès' };
    } catch (error) {
      throw new HttpException(
        'Erreur lors de la suppression du CV',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ✅ Helper : supprimer un fichier de façon non-bloquante et silencieuse
  private async safeDeleteFile(filePath: string): Promise<void> {
    try {
      await access(filePath); // Vérifie si le fichier existe (non-bloquant)
      await unlink(filePath); // Supprime (non-bloquant)
    } catch {
      // Fichier inexistant ou déjà supprimé — on ignore
    }
  }
}