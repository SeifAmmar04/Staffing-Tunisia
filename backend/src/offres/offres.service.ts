import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { pool } from '../db';

@Injectable()
export class OffreService {

  async findAll() {
    try {
      const result = await pool.query(`SELECT * FROM "Offre" ORDER BY "createdAt" DESC`);
      return result.rows;
    } catch (error) {
      console.error("ERREUR FINDALL:", error);
      throw new HttpException("SERVER_ERROR", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async create(data: any) {
    try {
      const result = await pool.query(
        `INSERT INTO "Offre"
        ("title","description","requirements","location","salary_range","typeContrat","experience","dateExpiration","categorie","createdAt")
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW())
        RETURNING *`,
        [
          data.title,
          data.description,
          data.requirements,
          data.location,
          data.salary_range,
          data.typeContrat,
          data.experience,
          data.dateExpiration,
          data.categorie ?? 'autre', 
        ]
      );
      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw new HttpException("Erreur création offre", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: number) {
    try {
      const result = await pool.query(
        `SELECT * FROM "Offre" WHERE id = $1`,
        [id]
      );
      if (result.rows.length === 0) {
        throw new HttpException("Offre non trouvée", HttpStatus.NOT_FOUND);
      }
      return result.rows[0];
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("SERVER_ERROR", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: number, data: any) {
    try {
      const result = await pool.query(
        `UPDATE "Offre"
        SET "title"=$1, "description"=$2, "requirements"=$3, "location"=$4,
        "salary_range"=$5, "typeContrat"=$6, "experience"=$7, "dateExpiration"=$8 ,"categorie"=$9 
        WHERE id=$10
        RETURNING *`,
        [
          data.title,
          data.description,
          data.requirements,
          data.location,
          data.salary_range,
          data.typeContrat,
          data.experience,
          data.dateExpiration,
          data.categorie ?? 'autre',
          id,
        ]
      );
      if (result.rows.length === 0) {
        throw new HttpException("Offre non trouvée", HttpStatus.NOT_FOUND);
      }
      return result.rows[0];
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Erreur update", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(id: number) {
    try {
      await pool.query(`DELETE FROM "Offre" WHERE id = $1`, [id]);
      return { message: "Offre supprimée" };
    } catch (error) {
      throw new HttpException("Erreur suppression", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}