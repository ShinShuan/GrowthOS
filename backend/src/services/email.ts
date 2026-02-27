import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const PDF_PATH = path.join(__dirname, '../../../pdf/output/Guide_10_RDV_automatiques.pdf');

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
    ? [{ filename: 'Guide_10_RDV_automatiques.pdf', path: PDF_PATH }]
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
          
          <p>Vous trouverez en pièce jointe votre guide :</p>
          <p style="font-weight:700; font-size:18px;">📄 <span class="highlight">Guide 10 RDV automatiques en 3 semaines</span></p>
          
          <p>Ce que vous allez découvrir :</p>
          
          <div class="step"><div class="step-num">1</div><div>Comment identifier vos <strong>247 contacts dormants</strong> qui représentent des revenus cachés</div></div>
          <div class="step"><div class="step-num">2</div><div>La méthode exacte pour les <strong>réactiver automatiquement</strong> avec l'IA</div></div>
          <div class="step"><div class="step-num">3</div><div>Les <strong>3 outils</strong> que les meilleures agences utilisent en secret</div></div>
          <div class="step"><div class="step-num">4</div><div>Les études de cas <strong>Lyon, Paris, Toulouse</strong> avec ROI calculé</div></div>
          
          <div class="stat">
            💡 <strong>Stat clé :</strong> Nos clients génèrent en moyenne <span class="highlight">10-15 RDV qualifiés</span> dès la 3ème semaine.
          </div>
          
          <div class="ps">
            <strong>PS :</strong> Vous avez 247 contacts dormants dans votre téléphone ?<br/>
            Je peux vous montrer en <strong>10 min exactement</strong> combien ils vous font perdre chaque mois.<br/><br/>
            Répondez simplement <strong>"OUI"</strong> à cet email et je vous appelle demain matin.<br/><br/>
            À très vite,<br/>
            <strong>Marc</strong><br/>
            <span style="color:#00D4FF">Fondateur SalesHunter</span><br/>
            <span style="color:#666; font-size:12px;">+33 X XX XX XX XX</span>
          </div>
        </div>
      </body>
      </html>
    `,
    attachments,
  });
}
