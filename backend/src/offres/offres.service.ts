import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { pool } from '../db';

@Injectable()
export class OffreService {

 async findAll() {
    try {
      const result = await pool.query(`SELECT * FROM "Offre" `);
      console.log("ROWS:", result.rows); // ← ajoutez cette ligne
      return result.rows;
    } catch (error) {
      console.error("ERREUR FINDALL:", error); // ← et celle-ci
      throw new HttpException("SERVER_ERROR", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async create(data: any) {
    try {
      const result = await pool.query(
        `INSERT INTO "Offre"
        ("titre","description","typeContrat","localisation","competencesRequises","salairePropose","datePublication","dateExpiration")
        VALUES ($1,$2,$3,$4,$5,$6,NOW(),$7)
        RETURNING *`,
        [
          data.titre,
          data.description,
          data.typeContrat,
          data.localisation,
          data.competencesRequises,
          data.salairePropose,
          data.dateExpiration,
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
        SET titre=$1, description=$2, typeContrat=$3, localisation=$4,
        competencesRequises=$5, salairePropose=$6, dateExpiration=$7
        WHERE id=$8
        RETURNING *`,
        [
          data.titre,
          data.description,
          data.typeContrat,
          data.localisation,
          data.competencesRequises,
          data.salairePropose,
          data.dateExpiration,
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