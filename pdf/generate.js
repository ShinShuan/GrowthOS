const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, 'output');
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const doc = new PDFDocument({
    size: 'A4',
    margin: 0,
    info: {
        Title: 'GrowthOS - L\'Infrastructure de Vente Autonome',
        Author: 'GrowthOS'
    }
});

const outPath = path.join(OUTPUT_DIR, 'GrowthOS_Guide_Strategique.pdf');
doc.pipe(fs.createWriteStream(outPath));

// COLORS (GrowthOS B&W Theme)
const C = {
    black: '#000000',
    white: '#FFFFFF',
    zinc: '#71717a',
    zincLight: '#a1a1aa',
    zincDark: '#27272a',
    blue: '#00D4FF' // Subtle accent for links/tech feel
};

const W = 595.28, H = 841.89;

// UTILS
function bg(color = C.black) { doc.rect(0, 0, W, H).fill(color); }
function newPage(color = C.black) { doc.addPage(); bg(color); }

function heading(text, x, y, size = 28, color = C.white) {
    doc.font('Helvetica-Bold').fontSize(size).fillColor(color).text(text, x, y, { width: W - x * 2 });
}
function body(text, x, y, size = 11, color = C.zincLight, opts = {}) {
    doc.font('Helvetica').fontSize(size).fillColor(color).text(text, x, y, { width: W - x * 2, lineGap: 4, ...opts });
}
function accent(text, x, y, size = 12, color = C.white) {
    doc.font('Helvetica-Bold').fontSize(size).fillColor(color).text(text.toUpperCase(), x, y, { width: W - x * 2, characterSpacing: 1 });
}
function divider(y, color = C.zincDark) {
    doc.moveTo(50, y).lineTo(W - 50, y).strokeColor(color).lineWidth(1).stroke();
}
function card(x, y, w, h, color = C.zincDark, opacity = 0.5) {
    doc.roundedRect(x, y, w, h, 12).fillColor(color).fillOpacity(opacity).fill();
    doc.fillOpacity(1);
    doc.roundedRect(x, y, w, h, 12).strokeColor(C.zincDark).lineWidth(0.5).stroke();
}

// ─────────────────────────────────────────────────────────
// PAGE 1 — COVER
// ─────────────────────────────────────────────────────────
bg(C.black);

// Geometric background elements
doc.strokeColor(C.zincDark).lineWidth(0.5);
for (let i = 0; i < 10; i++) {
    doc.circle(W, H, 100 + i * 50).stroke();
}

heading('GROWTH', 50, 250, 64, C.white);
heading('OS', 50, 310, 64, C.white);

doc.rect(50, 385, 40, 4).fill(C.white);

doc.font('Helvetica-Bold').fontSize(14).fillColor(C.white).text('INFRASTRUCTURE DE VENTE AUTONOME', 50, 420, { characterSpacing: 2 });
doc.font('Helvetica').fontSize(12).fillColor(C.zinc).text('Le guide stratégique pour agences immobilières d\'élite.', 50, 445);

// Minimalist footer
doc.font('Helvetica-Bold').fontSize(10).fillColor(C.zinc).text('2024 © PROPRIÉTÉ DE GROWTHOS', 50, H - 60);
doc.font('Helvetica').fontSize(10).fillColor(C.zinc).text('STRATÉGIE · AUTOMATISATION · RÉSULTATS', W - 250 - 50, H - 60, { align: 'right', width: 250 });

// ─────────────────────────────────────────────────────────
// PAGE 2 — LA PHILOSOPHIE
// ─────────────────────────────────────────────────────────
newPage();
accent('Chapitre 01', 50, 70);
heading('L\'Hémorragie Silencieuse', 50, 100, 32);
divider(150);

body('Chaque jour, votre agence perd de l\'argent. Ce n\'est pas un problème de talent, c\'est un problème de structure. Un humain n\'est pas conçu pour suivre 500 prospects simultanément sans jamais faillir.', 50, 180, 13, C.white);

body('Le "Gap" de Performance :', 50, 260, 11, C.zinc);

card(50, 290, 235, 120, C.zincDark);
doc.font('Helvetica-Bold').fontSize(10).fillColor(C.white).text('L\'APPROCHE HUMAINE', 65, 305);
body('• Capacité limitée à 20-30 appels/jour\n• Oublis fréquents de relance\n• Horaires : 9h - 18h\n• Coût fixe élevé (Salaire + Charges)', 65, 330, 10);

card(310, 290, 235, 120, C.white, 1);
doc.font('Helvetica-Bold').fontSize(10).fillColor(C.black).text('L\'APPROCHE GROWTHOS', 325, 305);
doc.font('Helvetica').fontSize(10).fillColor(C.black).text('• Capacité illimitée (1000+ contacts)\n• 0 oubli, suivi chirurgical\n• Disponible 24h/24, 7j/7\n• Coût variable lié à la performance', 325, 330, { lineGap: 4 });

body('La réalité est brutale : 73% des leads sont abandonnés après la première tentative. GrowthOS transforme cette perte en opportunité systématique.', 50, 450, 12, C.white);

// Big stat message
doc.rect(50, 520, W - 100, 150).fill(C.zincDark);
heading('247', 50, 550, 52, C.white);
doc.font('Helvetica-Bold').fontSize(14).fillColor(C.white).text('contacts anonymes dans votre base', 170, 560);
body('C\'est le nombre moyen de prospects qualifiés qui dorment dans le CRM d\'une agence. À 5000€ la commission, c\'est un gisement d\'un million d\'euros.', 170, 585, 11, C.zincLight, { width: 330 });

// ─────────────────────────────────────────────────────────
// PAGE 3 — L'ÉCOSYSTÈME
// ─────────────────────────────────────────────────────────
newPage();
accent('Chapitre 02', 50, 70);
heading('L\'Écosystème Autonome', 50, 100, 32);
divider(150);

const agents = [
    { name: 'LE SCANNER (IA)', role: 'Extraction & Intelligence', desc: 'Analyse massive de vos bases de données et des plateformes immobilières. Il identifie les signaux faibles de vente avant vos concurrents.' },
    { name: 'MARC (AGENT VOCAL)', role: 'Qualification Humaine-Grade', desc: 'Notre IA vocale appelle vos prospects. Elle ne se contente pas de parler : elle écoute, répond aux objections et qualifie l\'intérêt réel.' },
    { name: 'BOOKING AGENT', role: 'Conversion & Logistique', desc: 'Une fois le lead chaud identifié, il synchronise les agendas et réserve le rendez-vous. Vous ne recevez que le résultat final.' }
];

agents.forEach((a, i) => {
    const y = 180 + i * 160;
    card(50, y, W - 100, 140, C.zincDark);
    doc.font('Helvetica-Bold').fontSize(16).fillColor(C.white).text(a.name, 75, y + 25);
    doc.font('Helvetica-Bold').fontSize(10).fillColor(C.zinc).text(a.role.toUpperCase(), 75, y + 48);
    body(a.desc, 75, y + 70, 11, C.zincLight, { width: W - 180 });

    // Tiny "Active" badge
    doc.circle(W - 100, y + 35, 4).fill(C.white);
    doc.font('Helvetica-Bold').fontSize(8).fillColor(C.white).text('ACTIVE AGENT', W - 180, y + 31, { align: 'right', width: 70 });
});

// ─────────────────────────────────────────────────────────
// PAGE 4 — SYNERGIE
// ─────────────────────────────────────────────────────────
newPage();
accent('Chapitre 03', 50, 70);
heading('Synergie & Flux', 50, 100, 32);
divider(150);

body('La puissance de GrowthOS ne réside pas dans un agent isolé, mais dans la fluidité de l\'information entre eux. Voici comment votre infrastructure travaille pendant que vous dormez.', 50, 180, 12, C.white);

// Simple Flow Diagram (Text based)
const flow = [
    '01. LE SCANNER extrait 500 contacts bruts',
    '02. TRI IA : Segmentation automatique des leads "Chauds"',
    '03. MARC initie 127 appels de qualification',
    '04. 34 PROSPECTS qualifiés avec succès',
    '05. BOOKING AGENT cale 12 mandats dans l\'agenda'
];

flow.forEach((f, i) => {
    const y = 280 + i * 60;
    doc.strokeColor(C.zincDark).lineWidth(1).moveTo(75, y - 20).lineTo(75, y + 40).stroke();
    doc.circle(75, y, 6).fill(C.white);
    doc.font('Helvetica-Bold').fontSize(12).fillColor(C.white).text(f, 100, y - 5);
});

doc.rect(50, 600, W - 100, 120).fill(C.white);
doc.font('Helvetica-Bold').fontSize(14).fillColor(C.black).text('RÉSULTAT NET', 75, 625);
doc.font('Helvetica').fontSize(12).fillColor(C.black).text('Vous passez de 500 numéros inconnus à 12 opportunités de mandats prêtes à être signées. Sans avoir passé un seul appel.', 75, 650, { width: W - 150 });

// ─────────────────────────────────────────────────────────
// PAGE 5 — CAS D'USAGE : CRM REVIVAL
// ─────────────────────────────────────────────────────────
newPage();
accent('Case Study 01', 50, 70);
heading('Réveil de CRM Dormant', 50, 100, 32);
divider(150);

body('Scénario : Une agence possédant 800 contacts accumulés sur 5 ans. 0 relance systématique effectuée.', 50, 180, 11, C.zinc);

card(50, 220, W - 100, 200, C.zincDark);
doc.font('Helvetica-Bold').fontSize(14).fillColor(C.white).text('L\'OPÉRATION "PHOENIX"', 75, 245);
body('• Durée : 14 jours\n• Contacts traités : 812\n• Taux de réponse IA : 42%\n• RDV Mandats générés : 18', 75, 280, 12, C.white);

heading('+84 000€', 70, 360, 36, C.white);
doc.font('Helvetica-Bold').fontSize(10).fillColor(C.zinc).text('CHIFFRE D\'AFFAIRES POTENTIEL DÉRIVÉ', 270, 375);

body('Observation : "Nous pensions que ces leads étaient morts. En réalité, ils attendaient juste que quelqu\'un les appelle au bon moment."', 50, 480, 12, C.white, { oblique: true });

// ─────────────────────────────────────────────────────────
// PAGE 6 — CAS D'USAGE : PIGE AUTO
// ─────────────────────────────────────────────────────────
newPage();
accent('Case Study 02', 50, 70);
heading('L\'IA de Pige 24/7', 50, 100, 32);
divider(150);

body('Scénario : Automatisation complète de la prospection sur les particuliers (PAP/LeBonCoin).', 50, 180, 11, C.zinc);

const steps = [
    { t: 'DÉTECTION', d: 'Le Scanner repère une annonce publiée il y a 5 min.' },
    { t: 'CONTACT', d: 'Marc appelle instantanément pour proposer un audit.' },
    { t: 'QUALIF', d: 'Il vérifie l\'urgence de vente et le prix souhaité.' },
    { t: 'ACTION', d: 'Il prend RDV pour l\'estimation physique.' }
];

steps.forEach((s, i) => {
    const y = 250 + i * 80;
    doc.font('Helvetica-Bold').fontSize(12).fillColor(C.white).text(s.t, 50, y);
    body(s.d, 180, y, 11, C.zincLight);
    divider(y + 40);
});

body('Avantage Concurrentiel : Vous arrivez chez le vendeur avant que ses concurrents n\'aient ouvert leur ordinateur.', 50, 600, 13, C.white, { align: 'center' });

// ─────────────────────────────────────────────────────────
// PAGE 7 — ROI & ÉCHELLE
// ─────────────────────────────────────────────────────────
newPage();
accent('Performance', 50, 70);
heading('Calculateur de ROI', 50, 100, 32);
divider(150);

body('L\'investissement dans une infrastructure de vente n\'est pas une dépense, c\'est un levier.', 50, 180, 12, C.white);

card(50, 230, W - 100, 300, C.white, 1);
doc.font('Helvetica-Bold').fontSize(16).fillColor(C.black).text('MODÈLE TYPE AGENCE PRO', 75, 260);

const calc = [
    ['Investissement GrowthOS', '4 997 € / mois'],
    ['Volume de leads traités', '500 leads'],
    ['RDV Qualifiés générés', '15 RDV'],
    ['Mandats signés (Closing 20%)', '3 Mandats'],
    ['CA Généré (Com. 6000€)', '18 000 €']
];

calc.forEach((item, i) => {
    const y = 300 + i * 35;
    doc.font('Helvetica').fontSize(11).fillColor(C.black).text(item[0], 75, y);
    doc.font('Helvetica-Bold').fontSize(11).fillColor(C.black).text(item[1], W - 200, y, { align: 'right', width: 125 });
});

doc.rect(75, 480, W - 150, 1).fill(C.black);
doc.font('Helvetica-Bold').fontSize(18).fillColor(C.black).text('ROI : 3.6x', 75, 500);

// ─────────────────────────────────────────────────────────
// PAGE 8 — NEXT STEPS
// ─────────────────────────────────────────────────────────
bg(C.black);
heading('PRÊT POUR', 50, 250, 64, C.white);
heading('L\'AUTONOMIE ?', 50, 310, 64, C.white);

body('L\'infrastructure de demain ne dort pas. La vôtre non plus.', 50, 420, 14, C.white);

doc.rect(50, 480, W - 100, 80).fill(C.white);
doc.font('Helvetica-Bold').fontSize(18).fillColor(C.black).text('RÉSERVER MON AUDIT IA', 50, 510, { align: 'center', width: W - 100 });

body('Envoyez "OUI" en réponse à l\'email reçu ou contactez-nous :', 50, 600, 11, C.zinc, { align: 'center' });
doc.font('Helvetica-Bold').fontSize(12).fillColor(C.white).text('contact@growthos.fr', 50, 630, { align: 'center', width: W - 100 });

doc.end();
console.log(`✅ PDF "GrowthOS_Guide_Strategique.pdf" généré avec succès.`);
