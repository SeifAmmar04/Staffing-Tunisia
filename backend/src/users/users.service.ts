import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { pool } from '../db';
import * as bcrypt from 'bcrypt';
import { Resend } from 'resend';

@Injectable()
export class UsersService {

  private otpStore = new Map<string, { code: string; expiry: number }>();

  // ── READ ──────────────────────────────────────────────────────────────────

  async findAllCandidates() {
    const result = await pool.query(
      `SELECT id, "firstName", "lastName", email, phone, role, "createdAt"
       FROM "User"
       WHERE role = 'CANDIDATE'
       ORDER BY "createdAt" DESC`
    );
    return result.rows;
  }

  async findById(id: number) {
    const result = await pool.query(
      `SELECT id, "firstName", "lastName", email, phone, role, "createdAt"
       FROM "User" WHERE id = $1`,
      [id]
    );
    if (!result.rows[0]) throw new HttpException('Utilisateur non trouvé', HttpStatus.NOT_FOUND);
    const user = result.rows[0];
    return {
      ...user,
      phone: user.phone && String(user.phone).trim() ? String(user.phone).trim() : "",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
    };
  }

  async findByEmail(email: string) {
    const result = await pool.query(
      `SELECT id, "firstName", "lastName", email, phone, role, "createdAt"
       FROM "User" WHERE email = $1`,
      [email]
    );
    if (!result.rows[0]) throw new HttpException('Utilisateur non trouvé', HttpStatus.NOT_FOUND);
    const user = result.rows[0];
    return { ...user, phone: user.phone && String(user.phone).trim() ? String(user.phone).trim() : "" };
  }

  async checkEmail(email: string) {
    const result = await pool.query(`SELECT id FROM "User" WHERE email = $1`, [email]);
    return { exists: result.rows.length > 0 };
  }

  // ── WRITE ─────────────────────────────────────────────────────────────────

  async create(data: { firstName: string; lastName: string; phone?: string; email: string; password: string; }) {
    try {
      const existingUser = await pool.query(`SELECT id FROM "User" WHERE email = $1`, [data.email]);
      if (existingUser.rows.length > 0) throw new HttpException({ message: 'EMAIL_EXISTS' }, HttpStatus.BAD_REQUEST);

      const hashedPassword = await bcrypt.hash(data.password, 10);
      const result = await pool.query(
        `INSERT INTO "User" ("firstName", "lastName", phone, email, password, role, "createdAt")
         VALUES ($1, $2, $3, $4, $5, $6, NOW())
         RETURNING id, "firstName", "lastName", email, phone, role, "createdAt"`,
        [data.firstName, data.lastName, data.phone || "", data.email, hashedPassword, 'CANDIDATE']
      );
      const user = result.rows[0];
      return { ...user, phone: user.phone && String(user.phone).trim() ? String(user.phone).trim() : "" };
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      if (error.code === '23505') throw new HttpException({ message: 'EMAIL_EXISTS' }, HttpStatus.BAD_REQUEST);
      throw new HttpException({ message: 'SERVER_ERROR' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: number, data: { firstName?: string; lastName?: string; email?: string; phone?: string; }) {
    const existing = await pool.query(`SELECT id FROM "User" WHERE id = $1`, [id]);
    if (existing.rows.length === 0) throw new HttpException('Utilisateur non trouvé', HttpStatus.NOT_FOUND);

    if (data.email) {
      const emailCheck = await pool.query(`SELECT id FROM "User" WHERE email = $1 AND id != $2`, [data.email, id]);
      if (emailCheck.rows.length > 0) throw new HttpException('Email déjà utilisé', HttpStatus.BAD_REQUEST);
    }

    const result = await pool.query(
      `UPDATE "User" SET "firstName" = COALESCE($1, "firstName"), "lastName" = COALESCE($2, "lastName"),
       email = COALESCE($3, email), phone = COALESCE($4, phone)
       WHERE id = $5 RETURNING id, "firstName", "lastName", email, phone, role, "createdAt"`,
      [data.firstName ?? null, data.lastName ?? null, data.email ?? null, data.phone ?? null, id]
    );
    if (!result.rows[0]) throw new HttpException('Erreur lors de la mise à jour', HttpStatus.INTERNAL_SERVER_ERROR);
    const user = result.rows[0];
    return { ...user, phone: user.phone && String(user.phone).trim() ? String(user.phone).trim() : "" };
  }

  async changePassword(id: number, currentPassword: string, newPassword: string) {
    const result = await pool.query(`SELECT password FROM "User" WHERE id = $1`, [id]);
    if (result.rows.length === 0) throw new HttpException('Utilisateur non trouvé', HttpStatus.NOT_FOUND);
    const isMatch = await bcrypt.compare(currentPassword, result.rows[0].password);
    if (!isMatch) throw new HttpException('Mot de passe actuel incorrect', HttpStatus.BAD_REQUEST);
    if (newPassword.length < 6) throw new HttpException('Minimum 6 caractères', HttpStatus.BAD_REQUEST);
    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query(`UPDATE "User" SET password = $1 WHERE id = $2`, [hashed, id]);
    return { message: 'Mot de passe modifié avec succès' };
  }

  async delete(id: number) {
    const existing = await pool.query(`SELECT id FROM "User" WHERE id = $1`, [id]);
    if (existing.rows.length === 0) throw new HttpException('Utilisateur non trouvé', HttpStatus.NOT_FOUND);
    try {
      await pool.query(`DELETE FROM "User" WHERE id = $1`, [id]);
      return { message: 'Candidat supprimé avec succès' };
    } catch (error: any) {
      if (error.code === '23503') throw new HttpException('Impossible de supprimer : données liées existantes', HttpStatus.CONFLICT);
      throw new HttpException('Erreur lors de la suppression', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ── OTP ───────────────────────────────────────────────────────────────────

  async sendOtp(email: string) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 10 * 60 * 1000;
    this.otpStore.set(email, { code, expiry });

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'Staffing Tunisia <onboarding@resend.dev>',
      to: email,
      subject: '🔐 Code de vérification - Staffing Tunisia',
      html: `
        <div style="font-family: Arial; padding: 20px; max-width: 500px;">
          <h2 style="color: #dc2626;">Staffing Tunisia</h2>
          <p>Votre code de vérification est :</p>
          <div style="font-size: 36px; font-weight: bold; color: #dc2626;
                      letter-spacing: 8px; padding: 20px; background: #f9f9f9;
                      border-radius: 8px; text-align: center;">
            ${code}
          </div>
          <p style="color: #888; margin-top: 16px;">Ce code expire dans <b>10 minutes</b>.</p>
        </div>
      `,
    });
    return { message: 'OTP envoyé' };
  }

  async verifyOtp(email: string, code: string) {
    const stored = this.otpStore.get(email);
    if (!stored) throw new HttpException('Code introuvable ou expiré', HttpStatus.BAD_REQUEST);
    if (Date.now() > stored.expiry) {
      this.otpStore.delete(email);
      throw new HttpException('Code expiré', HttpStatus.BAD_REQUEST);
    }
    if (stored.code !== code) throw new HttpException('Code invalide', HttpStatus.BAD_REQUEST);
    this.otpStore.delete(email);
    return { verified: true };
  }
}
