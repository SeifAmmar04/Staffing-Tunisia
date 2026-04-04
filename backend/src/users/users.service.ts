import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { pool } from '../db';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  async checkEmail(email: string) {
    const result = await pool.query(
      `SELECT * FROM "User" WHERE email = $1`,
      [email]
    );
    return { exists: result.rows.length > 0 };
  }

  async create(data: any) {
    try {
      const existingUser = await pool.query(
        `SELECT * FROM "User" WHERE email = $1`,
        [data.email]
      );

      if (existingUser.rows.length > 0) {
        throw new HttpException(
          { message: "EMAIL_EXISTS" },
          HttpStatus.BAD_REQUEST
        );
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const result = await pool.query(
        `INSERT INTO "User"
        ("firstName","lastName","phone","email","password","role","createdAt")
        VALUES ($1,$2,$3,$4,$5,$6,NOW())
        RETURNING *`,
        [
          data.firstName,
          data.lastName,
          data.phone,
          data.email,
          hashedPassword,
          'CANDIDATE',  // ← majuscules pour correspondre au type ENUM
        ]
      );

      return result.rows[0];

    } catch (error: any) {
      console.error("DB ERROR:", error);

      if (error instanceof HttpException) throw error;

      if (error.code === '23505') {
        throw new HttpException(
          { message: "EMAIL_EXISTS" },
          HttpStatus.BAD_REQUEST
        );
      }

      throw new HttpException(
        { message: "SERVER_ERROR" },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}