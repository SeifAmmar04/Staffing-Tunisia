import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { pool } from '../db';
import * as bcrypt from 'bcrypt';
import * as jsonwebtoken from 'jsonwebtoken';
import * as nodemailer from 'nodemailer';

const JWT_SECRET = 'staffing_secret_key';

@Injectable()
export class AuthService {

  // ✅ Transporter créé en méthode privée → .env déjà chargé au moment de l'appel
  private getTransporter() {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
  }

  // ─────────────────────────────────────────────
  // Google OAuth
  // ─────────────────────────────────────────────
  async loginWithGoogle(data: any) {
    const result = await pool.query(
      `SELECT * FROM "User" WHERE email = $1`,
      [data.email]
    );

    let user;

    if (result.rows.length === 0) {
      const newUser = await pool.query(
        `INSERT INTO "User"
        ("firstName","lastName","email","password","role","createdAt")
        VALUES ($1,$2,$3,$4,$5,NOW())
        RETURNING *`,
        [data.firstName, data.lastName, data.email, 'GOOGLE_AUTH', 'CANDIDATE']
      );
      user = newUser.rows[0];
    } else {
      user = result.rows[0];
    }

    return {
      success: true,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone ?? null,
        role: user.role,
        provider: 'google',
      },
    };
  }

  // ─────────────────────────────────────────────
  // Login classique
  // ─────────────────────────────────────────────
  async login(data: any) {
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
    let isValid = false;

    if (user.role === 'ADMIN') {
      isValid = data.password === user.password;
    } else {
      isValid = await bcrypt.compare(data.password, user.password);
    }

    if (!isValid) {
      throw new HttpException(
        { message: 'WRONG_PASSWORD' },
        HttpStatus.UNAUTHORIZED
      );
    }

    const token = jsonwebtoken.sign(
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
        phone: user.phone ?? null,
        role: user.role,
        provider: 'local',
      },
    };
  }

  // ─────────────────────────────────────────────
  // ✅ Mot de passe oublié → envoie email
  // ─────────────────────────────────────────────
  async forgotPassword(email: string) {
    // 1. Vérifier que l'email existe
    const result = await pool.query(
      `SELECT id, "firstName" FROM "User" WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      throw new HttpException(
        { message: 'EMAIL_NOT_FOUND' },
        HttpStatus.NOT_FOUND
      );
    }

    const user = result.rows[0];

    // 2. Générer un token JWT valide 1 heure
    const resetToken = jsonwebtoken.sign(
      { userId: user.id, email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 3. Construire le lien de reset
    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetLink = `${FRONTEND_URL}/auth/reset-password?token=${resetToken}`;

    // 4. Envoyer l'email ✅ transporter créé ici
    const transporter = this.getTransporter();

    await transporter.sendMail({
      from: `"Staffing Tunisia" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Réinitialisation de votre mot de passe',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: auto; padding: 32px; border: 1px solid #eee; border-radius: 16px;">
          <img src="${FRONTEND_URL}/logo.png" alt="Staffing Tunisia" style="width: 160px; margin-bottom: 24px;" />
          <h2 style="color: #dc2626; margin-bottom: 8px;">Réinitialisation du mot de passe</h2>
          <p style="color: #374151;">Bonjour <strong>${user.firstName}</strong>,</p>
          <p style="color: #374151;">Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous :</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetLink}"
              style="background:#dc2626; color:white; padding:14px 32px; border-radius:10px; text-decoration:none; font-weight:bold; font-size:15px;">
              Réinitialiser mon mot de passe
            </a>
          </div>
          <p style="color:#6b7280; font-size:13px;">
            ⏱ Ce lien expire dans <strong>1 heure</strong>.<br/>
            Si vous n'avez pas fait cette demande, ignorez cet e-mail.
          </p>
          <hr style="border:none; border-top:1px solid #f3f4f6; margin: 24px 0;" />
          <p style="color:#9ca3af; font-size:11px; text-align:center;">© 2026 Staffing Tunisia. Tous droits réservés.</p>
        </div>
      `,
    });

    return { message: 'EMAIL_SENT' };
  }

  // ─────────────────────────────────────────────
  // ✅ Reset mot de passe → vérifie token + update
  // ─────────────────────────────────────────────
  async resetPassword(token: string, newPassword: string) {
    // 1. Vérifier le token
    let decoded: any;
    try {
      decoded = jsonwebtoken.verify(token, JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new HttpException(
          { message: 'TOKEN_EXPIRED' },
          HttpStatus.UNAUTHORIZED
        );
      }
      throw new HttpException(
        { message: 'INVALID_TOKEN' },
        HttpStatus.BAD_REQUEST
      );
    }

    // 2. Vérifier que l'utilisateur existe toujours
    const result = await pool.query(
      `SELECT id FROM "User" WHERE id = $1`,
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      throw new HttpException(
        { message: 'USER_NOT_FOUND' },
        HttpStatus.NOT_FOUND
      );
    }

    // 3. Valider le nouveau mot de passe
    if (!newPassword || newPassword.length < 6) {
      throw new HttpException(
        { message: 'PASSWORD_TOO_SHORT' },
        HttpStatus.BAD_REQUEST
      );
    }

    // 4. Hasher et sauvegarder
    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query(
      `UPDATE "User" SET password = $1 WHERE id = $2`,
      [hashed, decoded.userId]
    );

    return { message: 'PASSWORD_RESET_SUCCESS' };
  }
}