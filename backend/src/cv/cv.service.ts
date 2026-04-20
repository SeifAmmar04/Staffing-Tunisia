// cv.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { pool } from '../db';

@Injectable()
export class CvService {

  // ✅ Sauvegarder/Mettre à jour le CV d'un utilisateur
  async saveUserCV(userId: number, cvPath: string, originalName: string) {
    try {
      const existing = await pool.query(
        'SELECT id FROM cvs WHERE user_id = $1',
        [userId],
      );

      let result;

      if (existing.rows.length > 0) {
        // Mettre à jour le CV existant
        result = await pool.query(
          `UPDATE cvs 
           SET cv_path = $1, original_name = $2, updated_at = NOW() 
           WHERE user_id = $3 
           RETURNING *`,
          [cvPath, originalName, userId],
        );
      } else {
        // Créer un nouveau CV
        result = await pool.query(
          `INSERT INTO cvs (user_id, cv_path, original_name, created_at) 
           VALUES ($1, $2, $3, NOW()) 
           RETURNING *`,
          [userId, cvPath, originalName],
        );
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error saving user CV:', error);
      // ✅ Propager l'erreur au lieu de l'avaler
      throw new HttpException(
        'Erreur lors de la sauvegarde du CV',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ✅ Récupérer le CV d'un utilisateur
  async getUserCV(userId: number) {
    try {
      const result = await pool.query(
        `SELECT * FROM cvs WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`,
        [userId],
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error getting user CV:', error);
      // ✅ Propager l'erreur DB plutôt que retourner null silencieusement
      throw new HttpException(
        'Erreur lors de la récupération du CV',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ✅ Supprimer le CV d'un utilisateur
  async deleteUserCV(userId: number) {
    try {
      await pool.query('DELETE FROM cvs WHERE user_id = $1', [userId]);
      return { message: 'CV supprimé avec succès' };
    } catch (error) {
      console.error('Error deleting user CV:', error);
      throw new HttpException(
        'Erreur lors de la suppression du CV',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}