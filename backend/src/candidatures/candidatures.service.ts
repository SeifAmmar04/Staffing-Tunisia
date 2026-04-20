import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { pool } from '../db';

@Injectable()
export class CandidaturesService {

  async create(
    job_id: number,
    applicant_id: number | null,
    first_name: string,
    last_name: string,
    email: string,
    phone: string,
    resume_path: string,
    message: string,        // ← AJOUTÉ
  ) {
    const result = await pool.query(
      `INSERT INTO "Application" (job_id, applicant_id, first_name, last_name, email, phone, resume_path, message)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [job_id, applicant_id ?? null, first_name, last_name, email, phone, resume_path, message ?? null],
    );
    return result.rows[0];
  }

  // ← TRI : PENDING en premier, puis par date
  async findAll() {
    const result = await pool.query(
      `SELECT a.*, o.title as job_title
       FROM "Application" a
       LEFT JOIN "Offre" o ON a.job_id = o.id
       ORDER BY 
         CASE WHEN a.status = 'PENDING' OR a.status IS NULL THEN 0 ELSE 1 END,
         a."createdAt" DESC`
    );
    return result.rows;
  }

  async findById(id: number) {
    const result = await pool.query(
      `SELECT * FROM "Application" WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  }

  // ← ERREUR HTTP si non trouvé
  async updateStatus(id: number, status: string) {
    const validStatuses = ['PENDING', 'ACCEPTED', 'REJECTED'];
    if (!validStatuses.includes(status)) {
      throw new HttpException('Statut invalide', HttpStatus.BAD_REQUEST);
    }
    const result = await pool.query(
      `UPDATE "Application" SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );
    if (result.rows.length === 0)
      throw new HttpException('Candidature non trouvée', HttpStatus.NOT_FOUND);
    return result.rows[0];
  }

  async delete(id: number) {
    await pool.query(`DELETE FROM "Application" WHERE id = $1`, [id]);
    return { message: 'Application supprimée' };
  }
}