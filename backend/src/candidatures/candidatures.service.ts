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
    message: string,
  ) {
    // 1. INSERT candidature
    const result = await pool.query(
      `INSERT INTO "Application" (job_id, applicant_id, first_name, last_name, email, phone, resume_path, message)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [job_id, applicant_id ?? null, first_name, last_name, email, phone, resume_path, message ?? null],
    );
    const application = result.rows[0];

    // 2. Récupérer l'offre
    const offreResult = await pool.query(
      `SELECT title, description, requirements FROM "Offre" WHERE id = $1`,
      [job_id]
    );
    const offre = offreResult.rows[0];

    // 3. Appeler ia-service en arrière-plan (sans bloquer la réponse)
    if (offre && resume_path) {
      this.callIaService({
        application_id: application.id,
        resume_path: resume_path,
        offre_title: offre.title,
        offre_description: offre.description || '',
        offre_requirements: offre.requirements || ''
      });
    }

    return application;
  }

  // ✅ Appel IA sans await → ne bloque pas la réponse au candidat
  private async callIaService(data: {
    application_id: number;
    resume_path: string;
    offre_title: string;
    offre_description: string;
    offre_requirements: string;
  }) {
    try {
      const response = await fetch(`${process.env.IA_SERVICE_URL}/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        console.error('❌ IA Service error:', await response.text());
      } else {
        const result = await response.json();
        console.log(`✅ Score IA : ${result.score}/10 — ${result.resume}`);
      }
    } catch (error) {
      console.error('❌ IA Service inaccessible:', error.message);
    }
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
