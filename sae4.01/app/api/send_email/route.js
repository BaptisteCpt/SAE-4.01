import prisma from '../../lib/prisma';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
export async function POST(req) {
  try {
    const { email } = await req.json();
    
    if (!email) return NextResponse.json({ error: 'Email manquant' }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { mail: email } });
    if (!user) return NextResponse.json({ message: 'Demande prise en compte' }, { status: 200 });

    const resetToken = crypto.randomBytes(32).toString('hex');
    await prisma.user.update({
      where: { mail: email },
      data: { resettoken: resetToken }
    });
    const resetUrl = `http://localhost:3000/reinitialisermdp?token=${resetToken}`;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,    
      to: email,                     
      subject: '🔑 Bâti Parti - Réinitialisation de votre mot de passe',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
            <h2>Bonjour ${user.prenom || ''},</h2>
            <p>Vous avez demandé à réinitialiser votre mot de passe sur <b>Bâti Parti</b>.</p>
            <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
            <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px;">
                Réinitialiser mon mot de passe
            </a>
            <p style="color: gray; font-size: 12px;">Si vous n'avez pas demandé cette réinitialisation, ignorez simplement cet email.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Vrai email envoyé avec succès à ${email}`);

    return NextResponse.json({ message: 'Email envoyé avec succès' }, { status: 200 });

  } catch (error) { 
    console.error("Erreur lors de l'envoi du mail :", error);
    return NextResponse.json({ error: 'Erreur lors de l\'envoi de l\'email' }, { status: 500 });
  }
}