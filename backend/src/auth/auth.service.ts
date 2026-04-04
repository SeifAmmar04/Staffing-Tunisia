import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { pool } from '../db';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = 'staffing_secret_key';

@Injectable()
export class AuthService {
  async loginWithGoogle(data: any) {
  // ✅ Vérifie si l'utilisateur existe déjà
  const result = await pool.query(
    `SELECT * FROM "User" WHERE email = $1`,
    [data.email]
  );

  let user;

  if (result.rows.length === 0) {
    // ✅ Crée le compte automatiquement
    const newUser = await pool.query(
      `INSERT INTO "User"
      ("firstName","lastName","email","password","role","createdAt")
      VALUES ($1,$2,$3,$4,$5,NOW())
      RETURNING *`,
      [
        data.firstName,
        data.lastName,
        data.email,
        'GOOGLE_AUTH',
        'CANDIDATE',
      ]
    );
    user = newUser.rows[0];
  } else {
    user = result.rows[0];
  }

  return { success: true, user };
}
  async login(data: any) {
    // ✅ vérifier email
    const result = await pool.query(
      `SELECT * FROM "User" WHERE email = $1`,
      [data.email]
    );

    if (result.rows.length === 0) {
      throw new HttpException(
        { message: 'EMAIL_NOT_FOUND' },
        HttpStatus.UNAUTHORIZED
      );
    }

    const user = result.rows[0];

    // ✅ vérifier mot de passe selon le rôle
    let isValid = false;

    if (user.role === 'ADMIN') {
      // Admin → comparaison directe sans hash
      isValid = data.password === user.password;
    } else {
      // Candidat → comparaison avec bcrypt
      isValid = await bcrypt.compare(data.password, user.password);
    }

    if (!isValid) {
      throw new HttpException(
        { message: 'WRONG_PASSWORD' },
        HttpStatus.UNAUTHORIZED
      );
    }

    // ✅ générer token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    };
  }
}