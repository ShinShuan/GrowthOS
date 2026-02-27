import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const PDF_PATH = path.join(__dirname, '../../../pdf/output/GrowthOS_Guide_Strategique.pdf');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.zoho.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 5000, // 5s timeout
  greetingTimeout: 5000,
  socketTimeout: 5000,
});

export async function sendPdfEmail({ nom, email }: { nom: string; email: string }) {
  const prenom = nom.split(' ')[0];

  // Check if PDF exists
  const hasPdf = fs.existsSync(PDF_PATH);

  const attachments = hasPdf
    ? [{ filename: 'GrowthOS_Guide_Strategique.pdf', path: PDF_PATH }]
    : [];

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'Marc <contact@growthos.fr>',
    to: email,
    subject: `✅ Votre guide est prêt, ${prenom}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; }
          .container { padding: 40px 30px; }
          .logo { text-align: center; margin-bottom: 30px; }
          .logo span { font-size: 24px; font-weight: 900; color: #00D4FF; }
          .hero { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; padding: 30px; margin-bottom: 25px; border: 1px solid rgba(0,212,255,0.2); }
          .hero h1 { font-size: 22px; margin: 0 0 10px 0; }
          .highlight { color: #00D4FF; }
          .stat { background: rgba(0,212,255,0.1); border-radius: 10px; padding: 15px 20px; margin: 15px 0; border-left: 3px solid #00D4FF; }
          .btn { display: block; background: linear-gradient(135deg, #00D4FF, #0099CC); color: #000; text-decoration: none; text-align: center; padding: 16px 30px; border-radius: 50px; font-weight: 700; font-size: 16px; margin: 25px 0; }
          .ps { font-size: 14px; color: #aaa; padding: 20px; border-top: 1px solid #222; }
          .step { display: flex; align-items: flex-start; margin: 12px 0; }
          .step-num { background: #00D4FF; color: #000; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px; min-width: 24px; margin-right: 12px; margin-top: 2px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo"><span>Growth<span style="color:#fff">OS</span></span></div>
          
          <div class="hero">
            <h1>Bonjour ${prenom},<br/>Votre guide est prêt ! 🚀</h1>
            <p style="color:#ccc; margin:0;">Vous avez fait le premier pas vers l'automatisation de votre prospection.</p>
          </div>
          
          <p>Vous trouverez en pièce jointe votre guide stratégiqe :</p>
          <p style="font-weight:700; font-size:18px;">📄 <span class="highlight">L'Infrastructure de Vente Autonome</span></p>
          
          <p>Ce que vous allez découvrir :</p>
          
          <div class="step"><div class="step-num">1</div><div><strong>L'Hémorragie Silencieuse</strong> : Pourquoi votre CRM actuel vous fait perdre des milliers d'euros</div></div>
          <div class="step"><div class="step-num">2</div><div><strong>L'Écosystème d'Agents</strong> : Présentation de votre nouvelle équipe autonome (Scanner, Marc, Booking)</div></div>
          <div class="step"><div class="step-num">3</div><div><strong>Synergie & Flux</strong> : Comment l'information circule pour maximiser vos mandats</div></div>
          <div class="step"><div class="step-num">4</div><div><strong>Cas d'Usage Réels</strong> : Résultats concrets et ROI mesuré pour des agences comme la vôtre</div></div>
          
          <div class="stat">
            💡 <strong>Rappel :</strong> Votre infrastructure GrowthOS ne dort jamais. Elle travaille pendant que vous prospectez ou négociez.
          </div>
          
          <div class="ps">
            <strong>PS :</strong> Je peux vous montrer en <strong>10 min exactement</strong> comment activer cette infrastructure sur vos propres contacts.<br/><br/>
            Répondez simplement <strong>"OUI"</strong> à cet email et je vous appelle demain matin.<br/><br/>
            À très vite,<br/>
            <strong>Marc</strong><br/>
            <span style="color:#00D4FF">GrowthOS Infrastructure</span><br/>
            <span style="color:#666; font-size:12px;">Écosystème de Vente Autonome</span>
          </div>
        </div>
      </body>
      </html>
    `,
    attachments,
  });
}
