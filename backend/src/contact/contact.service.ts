import { Injectable } from '@nestjs/common';
import { pool } from '../db';
import * as nodemailer from 'nodemailer';

@Injectable()
export class ContactService {

  async sendContact(data: any) {
    // ✅ 1. Sauvegarde dans PostgreSQL
    await pool.query(
  `INSERT INTO "Contact" ("societe","nomComplet","email","telephone","services","message","createdAt")
   VALUES ($1,$2,$3,$4,$5,$6,NOW())`,
  [data.company, data.name, data.email, data.phone, data.services, data.message]
);

    // ✅ 2. Envoi email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.EMAIL_DEST,
      subject: `📩 Nouveau contact - ${data.name}`,
      html: `
        <h2>Nouveau message de contact</h2>
        <p><b>Société :</b> ${data.company || "—"}</p>
        <p><b>Nom :</b> ${data.name}</p>
        <p><b>Email :</b> ${data.email}</p>
        <p><b>Téléphone :</b> ${data.phone || "—"}</p>
        <p><b>Services :</b> ${data.services?.join(", ") || "—"}</p>
        <p><b>Message :</b><br/>${data.message}</p>
      `,
    });

    return { success: true };
  }
}