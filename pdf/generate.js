const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, 'output');
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const doc = new PDFDocument({ size: 'A4', margin: 0, info: { Title: 'Guide 10 RDV automatiques en 3 semaines', Author: 'SalesHunter' } });
const outPath = path.join(OUTPUT_DIR, 'Guide_10_RDV_automatiques.pdf');
doc.pipe(fs.createWriteStream(outPath));

// COLORS
const C = { dark: '#0a0a0a', navy: '#0d1b2a', blue: '#00D4FF', accent: '#FF6B35', white: '#FFFFFF', grey: '#aaaaaa', lightGrey: '#cccccc', green: '#00C851', card: '#1a2535' };
const W = 595.28, H = 841.89;

function bg(color = C.dark) { doc.rect(0, 0, W, H).fill(color); }
function newPage(color) { doc.addPage(); bg(color); }

function heading(text, x, y, size = 28, color = C.white) {
    doc.font('Helvetica-Bold').fontSize(size).fillColor(color).text(text, x, y, { width: W - x * 2 });
}
function body(text, x, y, size = 11, color = C.lightGrey, opts = {}) {
    doc.font('Helvetica').fontSize(size).fillColor(color).text(text, x, y, { width: W - x * 2, ...opts });
}
function accent(text, x, y, size = 13, color = C.blue) {
    doc.font('Helvetica-Bold').fontSize(size).fillColor(color).text(text, x, y, { width: W - x * 2 });
}
function divider(y, color = C.blue) {
    doc.moveTo(50, y).lineTo(W - 50, y).strokeColor(color).lineWidth(1).stroke();
}
function badge(text, x, y, bgColor = C.blue) {
    const pad = 8, tw = doc.font('Helvetica-Bold').fontSize(9).widthOfString(text);
    doc.rect(x, y - 2, tw + pad * 2, 20).fill(bgColor);
    doc.font('Helvetica-Bold').fontSize(9).fillColor(C.dark).text(text, x + pad, y + 2);
}
function card(x, y, w, h, color = C.card, stroke = C.blue) {
    doc.roundedRect(x, y, w, h, 8).fill(color);
    doc.roundedRect(x, y, w, h, 8).stroke(stroke).lineWidth(0.5);
}
function numberBullet(num, text, x, y) {
    doc.circle(x + 12, y + 7, 12).fill(C.blue);
    doc.font('Helvetica-Bold').fontSize(11).fillColor(C.dark).text(num, x + 7, y + 2);
    doc.font('Helvetica').fontSize(11).fillColor(C.white).text(text, x + 32, y, { width: W - x - 32 - 50 });
}
function checkItem(text, x, y) {
    doc.font('Helvetica-Bold').fontSize(12).fillColor(C.green).text('✓', x, y);
    doc.font('Helvetica').fontSize(11).fillColor(C.white).text(text, x + 20, y, { width: W - x - 20 - 50 });
}

// ─────────────────────────────────────────────────────────
// PAGE 1 — COUVERTURE
// ─────────────────────────────────────────────────────────
bg(C.navy);
doc.rect(0, 0, W, 6).fill(C.blue);
doc.rect(0, H - 6, W, 6).fill(C.blue);

doc.font('Helvetica-Bold').fontSize(14).fillColor(C.blue).text('SALESHUNTER', 50, 40, { align: 'center', width: W - 100 });
doc.font('Helvetica').fontSize(10).fillColor(C.grey).text('L\'IA au service des agences immobilières', 50, 60, { align: 'center', width: W - 100 });

doc.rect(0, 100, W, 4).fill(C.accent);

doc.font('Helvetica-Bold').fontSize(11).fillColor(C.blue).text('GUIDE GRATUIT · 20 PAGES', 50, 130, { align: 'center', width: W - 100 });

doc.font('Helvetica-Bold').fontSize(38).fillColor(C.white).text('10 RDV Qualifiés', 50, 165, { align: 'center', width: W - 100 });
doc.font('Helvetica-Bold').fontSize(38).fillColor(C.blue).text('en 3 Semaines', 50, 215, { align: 'center', width: W - 100 });
doc.font('Helvetica').fontSize(18).fillColor(C.lightGrey).text('La méthode exacte que utilisent', 50, 275, { align: 'center', width: W - 100 });
doc.font('Helvetica').fontSize(18).fillColor(C.lightGrey).text('les meilleures agences françaises', 50, 298, { align: 'center', width: W - 100 });

// Big stat box
card(75, 345, W - 150, 120, '#0d1b2e', C.blue);
doc.font('Helvetica-Bold').fontSize(52).fillColor(C.blue).text('247', 50, 365, { align: 'center', width: W - 100 });
doc.font('Helvetica-Bold').fontSize(14).fillColor(C.white).text('contacts dormants dans ton téléphone', 50, 428, { align: 'center', width: W - 100 });
doc.font('Helvetica').fontSize(11).fillColor(C.grey).text('= 370 000€ qui s\'évaporent chaque année', 50, 448, { align: 'center', width: W - 100 });

doc.font('Helvetica-Bold').fontSize(13).fillColor(C.accent).text('Ce guide te montre comment les réveiller automatiquement.', 50, 490, { align: 'center', width: W - 100 });

// Summary boxes
const items = [['🔍 Méthode 4 Étapes', 'Du scraping au closing'], ['📊 3 Études de Cas', 'Lyon · Paris · Toulouse'], ['💰 ROI Calculé', '3 semaines pour rentabiliser']];
items.forEach(([title, sub], i) => {
    const bx = 50 + i * 165, by = 540;
    card(bx, by, 155, 75, C.card, C.blue);
    doc.font('Helvetica-Bold').fontSize(10).fillColor(C.white).text(title, bx + 10, by + 12, { width: 135 });
    doc.font('Helvetica').fontSize(9).fillColor(C.grey).text(sub, bx + 10, by + 40, { width: 135 });
});

doc.font('Helvetica').fontSize(9).fillColor(C.grey).text('© 2024 SalesHunter · contact@saleshunter.fr · Confidentiel', 50, H - 45, { align: 'center', width: W - 100 });

// ─────────────────────────────────────────────────────────
// PAGE 2 — LE PROBLÈME
// ─────────────────────────────────────────────────────────
newPage(C.dark);
badge('CHAPITRE 1', 50, 50);
heading('Le Problème que Personne ne Voit', 50, 85, 24);
divider(130);

body('Vous avez probablement des centaines de contacts dans votre téléphone. Des prospects qui ont manifesté de l\'intérêt, des anciens clients, des personnes que vous avez rencontrées lors d\'événements...\n\nCes contacts dorment. Ils ne vous rapportent rien. Pourtant, ils représentent votre source de revenus la plus facile à activer.', 50, 145, 12);

const stats = [['247', 'contacts non relancés en moyenne par agent'], ['€370K', 'perdus chaque année par agence'], ['73%', 'des leads abandonnés après la 1ère tentative'], ['2.5x', 'plus facile de convertir un ancien contact']];
stats.forEach(([num, label], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const bx = 50 + col * 245, by = 300 + row * 110;
    card(bx, by, 225, 90, C.card, i < 2 ? C.blue : C.accent);
    doc.font('Helvetica-Bold').fontSize(34).fillColor(i < 2 ? C.blue : C.accent).text(num, bx + 15, by + 12);
    doc.font('Helvetica').fontSize(10).fillColor(C.lightGrey).text(label, bx + 15, by + 55, { width: 195 });
});

body('La vérité : 70% de vos contacts n\'ont jamais été correctement suivis. Pas parce que vous êtes mauvais commercial. Mais parce que vous manquez d\'un système.', 50, 540, 12, C.white);
doc.rect(50, 590, 4, 80).fill(C.blue);
body('La bonne nouvelle ? Ces contacts sont les plus faciles à convertir. Ils vous connaissent déjà. Il suffit de les réveiller au bon moment, avec le bon message.', 60, 595, 12, C.lightGrey);

// ─────────────────────────────────────────────────────────
// PAGE 3 — LA SOLUTION
// ─────────────────────────────────────────────────────────
newPage(C.dark);
badge('CHAPITRE 2', 50, 50);
heading('La Solution : 3 Outils qui Changent Tout', 50, 85, 24);
divider(130);

body('Les agences qui signent 50+ contrats par an ont un secret. Elles n\'ont pas plus de temps. Elles n\'ont pas plus de budget. Elles ont simplement automatisé les 3 tâches qui font 80% du résultat.', 50, 145, 12);

const tools = [
    { icon: '🔍', title: 'Outil 1 : Le Scraper Intelligent', sub: 'Identifie et segmente vos contacts dormants', desc: 'En 15 minutes, notre IA analyse votre base de données et identifie vos contacts les plus susceptibles de convertir. Score de chaleur, historique d\'interaction, timing optimal.', stat: '247 contacts analysés automatiquement' },
    { icon: '📞', title: 'Outil 2 : L\'Agent IA d\'Appels', sub: 'Appelle et qualifie vos prospects 24h/24', desc: 'Marc (notre IA) appelle vos contacts dormants, présente votre offre, répond aux objections basiques et qualifie l\'intérêt. Seuls les prospects chauds arrivent à vous.', stat: '80% du travail de prospection automatisé' },
    { icon: '📅', title: 'Outil 3 : Le Booking Automatique', sub: 'RDV qualifiés livrés directement dans votre agenda', desc: 'Une fois qualifié, le prospect est automatiquement invité à réserver un créneau. Fini les allers-retours. Le RDV apparaît dans votre agenda avec toutes les infos.', stat: '10-15 RDV qualifiés par semaine' },
];
tools.forEach((t, i) => {
    const by = 220 + i * 160;
    card(50, by, W - 100, 145, C.card, C.blue);
    doc.font('Helvetica-Bold').fontSize(14).fillColor(C.white).text(`${t.icon} ${t.title}`, 75, by + 15);
    doc.font('Helvetica-Bold').fontSize(10).fillColor(C.blue).text(t.sub, 75, by + 38);
    doc.font('Helvetica').fontSize(10).fillColor(C.lightGrey).text(t.desc, 75, by + 58, { width: W - 150 });
    badge(t.stat, 75, by + 110, C.green);
});

// ─────────────────────────────────────────────────────────
// PAGE 4 — MÉTHODE 4 ÉTAPES
// ─────────────────────────────────────────────────────────
newPage(C.dark);
badge('CHAPITRE 3', 50, 50);
heading('La Méthode en 4 Étapes', 50, 85, 24);
divider(130);

const steps = [
    { num: '1', title: 'SCRAPING & SEGMENTATION', time: 'Jour 1 · 15 minutes', desc: 'Exportez votre base de contacts depuis votre CRM ou téléphone. Notre outil analyse automatiquement chaque contact : dernière interaction, source, type de bien recherché, budget estimé. Il génère un score de 1 à 10 pour chaque lead. Vous vous concentrez sur les 8-10+.', actions: ['Export CRM ou CSV téléphone', 'Analyse IA automatique', 'Score de chaleur généré'] },
    { num: '2', title: 'ACTIVATION IA', time: 'Jour 2 · 0 minutes de votre temps', desc: 'L\'agent Marc (IA vocale) appelle automatiquement votre liste priorisée. Il suit un script personnalisé selon le profil du contact. Il note les réponses, gère les objections de base et identifie les leads chauds.', actions: ['Appels automatiques 9h-18h', 'Script personnalisé par profil', 'Objections gérées automatiquement'] },
    { num: '3', title: 'NURTURING & RELANCE', time: 'Jours 3-7 · Automatique', desc: 'Les leads qui n\'ont pas répondu reçoivent une séquence email/SMS personnalisée sur 5 jours. Contenu adapté : témoignages, valeur, urgence douce. Taux de réponse moyen : 40%.', actions: ['Séquence 5 emails automatique', 'SMS de relance J+3', 'Personnalisation dynamique'] },
    { num: '4', title: 'CLOSING & BOOKING', time: 'Semaine 2 · +2h/semaine', desc: 'Vous recevez uniquement les leads qualifiés avec un résumé complet : besoin, budget, timeline, objections. Le RDV est déjà booké. Vous n\'avez plus qu\'à closer.', actions: ['Fiche prospect complète', 'RDV pré-qualifié booké', 'Taux closing moyen : 25%'] },
];
steps.forEach((s, i) => {
    const by = 160 + i * 155;
    card(50, by, W - 100, 135, C.card, i % 2 === 0 ? C.blue : C.accent);
    doc.circle(75, by + 25, 18).fill(i % 2 === 0 ? C.blue : C.accent);
    doc.font('Helvetica-Bold').fontSize(16).fillColor(C.dark).text(s.num, 70, by + 17);
    doc.font('Helvetica-Bold').fontSize(13).fillColor(C.white).text(s.title, 105, by + 12);
    doc.font('Helvetica').fontSize(9).fillColor(i % 2 === 0 ? C.blue : C.accent).text(s.time, 105, by + 30);
    doc.font('Helvetica').fontSize(9).fillColor(C.lightGrey).text(s.desc, 75, by + 50, { width: W - 160 });
    s.actions.forEach((a, ai) => {
        doc.font('Helvetica-Bold').fontSize(9).fillColor(C.green).text('✓ ', 75 + ai * 155, by + 108);
        doc.font('Helvetica').fontSize(9).fillColor(C.grey).text(a, 87 + ai * 155, by + 108, { width: 140 });
    });
});

// ─────────────────────────────────────────────────────────
// PAGE 5 — ÉTUDE DE CAS LYON
// ─────────────────────────────────────────────────────────
newPage(C.dark);
badge('ÉTUDE DE CAS #1', 50, 50, C.accent);
heading('Agence Dumont Immobilier · Lyon', 50, 85, 22);
doc.font('Helvetica').fontSize(11).fillColor(C.grey).text('Agence de 5 agents · Spécialisée appartements · 8 ans d\'activité', 50, 115);
divider(140);

const lyonMetrics = [['Avant', '3 RDV/sem', C.grey], ['Après 3 sem.', '14 RDV/sem', C.green], ['Vente N°1', 'Jour 18', C.blue], ['ROI', '2 840%', C.accent]];
lyonMetrics.forEach(([label, val, col], i) => {
    const bx = 50 + i * 122;
    card(bx, 160, 112, 90, C.card, col);
    doc.font('Helvetica').fontSize(9).fillColor(C.grey).text(label, bx + 8, 175);
    doc.font('Helvetica-Bold').fontSize(20).fillColor(col).text(val, bx + 8, 198, { width: 96 });
});

body('Le contexte :', 50, 275, 12, C.blue);
body('Thomas Dumont avait 312 contacts dormants depuis plus de 6 mois. Il avait essayé de les relancer manuellement, mais abandonnait après 20-30 appels. "Je n\'ai pas le temps de faire ça", nous a-t-il dit lors de notre premier audit.', 50, 292, 11);

body('Ce que nous avons fait :', 50, 365, 12, C.blue);
const lyonActions = ['Importé 312 contacts depuis son CRM Immo', 'Segmenté automatiquement : 89 contacts "chauds" identifiés', 'L\'agent Marc a appelé les 89 contacts sur 2 jours', '34 ont répondu positivement, 11 RDV bookés automatiquement', 'Thomas a closé 4 des 11 RDV en semaine 2'];
lyonActions.forEach((a, i) => { checkItem(a, 50, 385 + i * 28); });

body('Le résultat :', 50, 540, 12, C.blue);
doc.rect(50, 560, W - 100, 100).fill('#0d2a1a');
doc.rect(50, 560, 4, 100).fill(C.green);
doc.font('Helvetica-Bold').fontSize(15).fillColor(C.green).text('4 ventes en 3 semaines · CA généré : 18 400€', 65, 578);
doc.font('Helvetica').fontSize(11).fillColor(C.lightGrey).text('Investissement SalesHunter : 4 997€\nROI : 2 840% · "J\'aurais dû le faire bien plus tôt" — Thomas D.', 65, 605);

// ─────────────────────────────────────────────────────────
// PAGE 6 — ÉTUDE DE CAS PARIS
// ─────────────────────────────────────────────────────────
newPage(C.dark);
badge('ÉTUDE DE CAS #2', 50, 50, C.accent);
heading('Cabinet Mercier & Associés · Paris', 50, 85, 22);
doc.font('Helvetica').fontSize(11).fillColor(C.grey).text('Cabinet 12 agents · Immobilier de prestige · Paris 7-8-16ème', 50, 115);
divider(140);

const parisMetrics = [['Pipeline avant', '45 contacts', C.grey], ['Réactivés', '127 contacts', C.blue], ['RDV générés', '23 RDV', C.green], ['CA additionnel', '€67 000', C.accent]];
parisMetrics.forEach(([label, val, col], i) => {
    const bx = 50 + i * 122;
    card(bx, 160, 112, 90, C.card, col);
    doc.font('Helvetica').fontSize(9).fillColor(C.grey).text(label, bx + 8, 175);
    doc.font('Helvetica-Bold').fontSize(16).fillColor(col).text(val, bx + 8, 198, { width: 96 });
});

body('Le contexte :', 50, 275, 12, C.blue);
body('Sophie Mercier gérait un cabinet de prestige parisien. Son problème n\'était pas le manque de leads entrants, mais tous les anciens contacts qui "dormaient". Des acheteurs qualifiés qui avaient cherché il y a 6-18 mois et n\'avaient pas trouvé. Un gisement d\'or inexploité.', 50, 292, 11);

body('L\'approche spécifique :', 50, 370, 12, C.blue);
const parisActions = ['Analyse de 514 contacts sur 24 mois d\'historique', 'Identification de 127 "acheteurs latents" (budget vérifié + projet actif)', 'Campagne de réactivation sur 10 jours', 'Message personnalisé : nouvelles opportunités dans leur budget/zone', '23 RDV pris · 8 ventes conclues en 5 semaines'];
parisActions.forEach((a, i) => { checkItem(a, 50, 390 + i * 28); });

body('Le résultat :', 50, 545, 12, C.blue);
doc.rect(50, 565, W - 100, 110).fill('#0d2a1a');
doc.rect(50, 565, 4, 110).fill(C.green);
doc.font('Helvetica-Bold').fontSize(15).fillColor(C.green).text('8 ventes · 67 000€ de CA additionnel en 5 semaines', 65, 582);
doc.font('Helvetica').fontSize(11).fillColor(C.lightGrey).text('Investissement : 4 997€ · ROI : 1 240%\n\n"Ce qui m\'a le plus surpris : des clients qui avaient cherché il y a un an ont acheté.\nIls attendaient juste qu\'on leur représente les bons biens." — Sophie M.', 65, 607);

// ─────────────────────────────────────────────────────────
// PAGE 7 — ÉTUDE DE CAS TOULOUSE
// ─────────────────────────────────────────────────────────
newPage(C.dark);
badge('ÉTUDE DE CAS #3', 50, 50, C.accent);
heading('Agence Rivière Immobilier · Toulouse', 50, 85, 22);
doc.font('Helvetica').fontSize(11).fillColor(C.grey).text('Agence indépendante · 2 agents · Budget serré · Métropole toulousaine', 50, 115);
divider(140);

const toulMetrics = [['Budget investi', '175€', C.grey], ['Leads capturés', '36 emails', C.blue], ['Vente N°1', 'Jour 16', C.accent], ['ROI', '+2 500%', C.green]];
toulMetrics.forEach(([label, val, col], i) => {
    const bx = 50 + i * 122;
    card(bx, 160, 112, 90, C.card, col);
    doc.font('Helvetica').fontSize(9).fillColor(C.grey).text(label, bx + 8, 175);
    doc.font('Helvetica-Bold').fontSize(18).fillColor(col).text(val, bx + 8, 198, { width: 96 });
});

body('Le cas le plus inspirant — Survival Mode :', 50, 275, 12, C.accent);
body('Marc Rivière avait un budget de 175€. Pas de CRM. Pas d\'historique client structuré. Juste un téléphone avec des contacts et une énorme motivation. C\'est le scénario le plus difficile — et celui qui prouve que la méthode fonctionne même en partant de zéro.', 50, 295, 11);

body('Le plan exact exécuté :', 50, 375, 12, C.blue);
const toulSteps = [
    ['Semaine 1-2 (100€)', 'Publicité Meta ciblée courtiers/agences Toulouse 50km · 5 créatifs testés · Landing page · 36 emails capturés'],
    ['Semaine 3 (50€)', 'Scale du créatif gagnant · Agent Marc appelle les 36 leads · 14 conversations · 7 audits proposés'],
    ['Semaine 4 (25€)', 'Retargeting + relances · 1 vente conclue 4 490€ · Réinvestissement immédiat'],
];
toulSteps.forEach(([step, desc], i) => {
    card(50, 400 + i * 110, W - 100, 95, C.card, C.accent);
    doc.font('Helvetica-Bold').fontSize(11).fillColor(C.accent).text(step, 70, 415 + i * 110);
    doc.font('Helvetica').fontSize(10).fillColor(C.lightGrey).text(desc, 70, 435 + i * 110, { width: W - 140 });
});

doc.rect(50, 740, W - 100, 60).fill('#1a0d2a');
doc.rect(50, 740, 4, 60).fill(C.accent);
doc.font('Helvetica-Bold').fontSize(14).fillColor(C.accent).text('175€ investis → 4 490€ encaissés en 16 jours · ROI : 2 566%', 65, 752);
doc.font('Helvetica').fontSize(10).fillColor(C.grey).text('"La méthode fonctionne même sans moyens. L\'essentiel c\'est le système." — Marc R.', 65, 775);

// ─────────────────────────────────────────────────────────
// PAGE 8 — ROI CALCULATOR
// ─────────────────────────────────────────────────────────
newPage(C.dark);
badge('CALCULATEUR ROI', 50, 50, C.green);
heading('Combien Perdez-vous Chaque Mois ?', 50, 85, 24);
divider(130);

body('Répondez honnêtement à ces 3 questions pour calculer vos pertes réelles :', 50, 150, 12);

const questions = ['Combien de contacts avez-vous dans votre CRM/téléphone non relancés depuis +3 mois ?', 'Quelle est votre commission moyenne par vente (en €) ?', 'Quel est votre taux de conversion moyen lead → vente (en %) ?'];
questions.forEach((q, i) => {
    const qy = 185 + i * 80;
    doc.font('Helvetica-Bold').fontSize(11).fillColor(C.blue).text(`Q${i + 1}. ${q}`, 50, qy, { width: W - 100 });
    doc.rect(50, qy + 28, W - 100, 36).fill(C.card);
    doc.rect(50, qy + 28, W - 100, 36).stroke('#333').lineWidth(1);
    doc.font('Helvetica').fontSize(10).fillColor('#555').text('Votre réponse ici...', 65, qy + 42);
});

body('Calcul automatique :', 50, 435, 12, C.blue);
card(50, 460, W - 100, 180, '#0a1a0a', C.green);
const formula = [
    ['Contacts dormants', '× 15%', '(taux de réactivation réaliste)'],
    ['= Leads réactivables', '× votre taux de conversion', ''],
    ['= Ventes supplémentaires', '× commission moyenne', ''],
    ['= Revenue mensuel caché', '', '→ Ce que vous perdez chaque mois'],
];
formula.forEach(([a, b, c], i) => {
    doc.font('Helvetica-Bold').fontSize(10).fillColor(C.green).text(a, 70, 475 + i * 35);
    doc.font('Helvetica').fontSize(10).fillColor(C.blue).text(b, 280, 475 + i * 35);
    doc.font('Helvetica').fontSize(9).fillColor(C.grey).text(c, 390, 477 + i * 35, { width: 140 });
});

doc.rect(50, 650, W - 100, 80).fill('#1a1a0a');
doc.font('Helvetica-Bold').fontSize(13).fillColor(C.accent).text('Exemple concret avec 247 contacts :', 65, 662);
doc.font('Helvetica').fontSize(11).fillColor(C.white).text('247 × 15% = 37 leads · 37 × 25% = 9 ventes · 9 × 4 490€ = 40 410€/an\n→ Soit 3 367€ perdus chaque mois sans système d\'automatisation', 65, 685, { width: W - 130 });

doc.font('Helvetica-Bold').fontSize(13).fillColor(C.blue).text('Vous voulez savoir votre chiffre exact ? → Page suivante', 50, 755, { align: 'center', width: W - 100 });

// ─────────────────────────────────────────────────────────
// PAGE 9 — L'OFFRE
// ─────────────────────────────────────────────────────────
newPage(C.dark);
badge('PASSEZ À L\'ACTION', 50, 50, C.blue);
heading('Obtenez Votre Audit Gratuit', 50, 85, 26);
divider(130);

body('Vous avez lu ce guide. Vous savez maintenant que vous laissez des dizaines de milliers d\'euros sur la table chaque mois.\n\nL\'étape suivante est simple : laissez-nous calculer votre potentiel exact.', 50, 150, 12);

card(50, 215, W - 100, 200, '#0d1b2e', C.blue);
doc.font('Helvetica-Bold').fontSize(18).fillColor(C.blue).text('🎯 Audit IA Gratuit (Valeur 297€)', 70, 235);
divider(268, '#1a3a5a');
const auditItems = ['Analyse de votre base de contacts (30 min)', 'Identification de vos 3 plus grosses opportunités cachées', 'Calcul précis de votre revenu mensuel perdu', 'Démonstration live de l\'agent Marc sur VOS contacts', 'Rapport PDF personnalisé envoyé sous 24h'];
auditItems.forEach((item, i) => { checkItem(item, 70, 278 + i * 28); });

doc.rect(50, 435, W - 100, 70).fill(C.blue);
doc.font('Helvetica-Bold').fontSize(18).fillColor(C.dark).text('→ Répondez OUI à l\'email reçu pour réserver', 50, 447, { align: 'center', width: W - 100 });
doc.font('Helvetica-Bold').fontSize(11).fillColor(C.dark).text('ou appelez directement : disponible dans votre email de confirmation', 50, 475, { align: 'center', width: W - 100 });

body('Nos offres (si l\'audit confirme le potentiel) :', 50, 530, 12, C.blue);
const offers = [['Agent Starter', '1 497€', 'TPE < 10 pers · 1 agent IA · Setup 48h'], ['Agent Pro', '4 997€', 'PME · 3 agents · CRM intégré · Support 90j'], ['Pack Transformation', '9 997€', '50+ pers · 10 agents · Formation équipe']];
offers.forEach(([name, price, desc], i) => {
    const bx = 50 + i * 165;
    card(bx, 555, 155, 120, C.card, i === 1 ? C.blue : '#333');
    if (i === 1) badge('POPULAIRE', bx + 35, 558, C.blue);
    doc.font('Helvetica-Bold').fontSize(11).fillColor(C.white).text(name, bx + 10, 578);
    doc.font('Helvetica-Bold').fontSize(22).fillColor(i === 1 ? C.blue : C.white).text(price, bx + 10, 598);
    doc.font('Helvetica').fontSize(8).fillColor(C.grey).text(desc, bx + 10, 630, { width: 135 });
});

doc.font('Helvetica').fontSize(10).fillColor(C.grey).text('✅ Garantie 30 jours satisfait ou remboursé · ✅ Pas d\'engagement long terme', 50, 700, { align: 'center', width: W - 100 });

// ─────────────────────────────────────────────────────────
// PAGE 10 — CONCLUSION
// ─────────────────────────────────────────────────────────
newPage(C.navy);
doc.rect(0, 0, W, 6).fill(C.blue);

heading('Ce Guide en 3 Points Clés', 50, 60, 24);
divider(100);

const keys = [
    { num: '1', title: 'Vous avez déjà les leads qu\'il vous faut', desc: 'Ils dorment dans votre téléphone et votre CRM. 247 contacts en moyenne par agent non relancés depuis +3 mois. C\'est votre mine d\'or inexploitée.' },
    { num: '2', title: 'L\'automatisation fait 80% du travail', desc: 'Vous n\'avez pas besoin de travailler plus. Vous avez besoin d\'un système : scraper → IA appels → nurturing → booking. Tout en automatique, pendant que vous dormez.' },
    { num: '3', title: 'Les résultats arrivent en 3 semaines', desc: 'Lyon : 4 ventes. Paris : 8 ventes. Toulouse : 1ère vente avec 175€ de budget. La méthode est prouvée, replicable, et adaptée à votre marché local.' },
];
keys.forEach((k, i) => {
    const ky = 130 + i * 165;
    card(50, ky, W - 100, 145, C.card, C.blue);
    doc.circle(82, ky + 30, 22).fill(C.blue);
    doc.font('Helvetica-Bold').fontSize(20).fillColor(C.dark).text(k.num, i < 2 ? 76 : 76, ky + 20);
    doc.font('Helvetica-Bold').fontSize(14).fillColor(C.white).text(k.title, 120, ky + 18);
    doc.font('Helvetica').fontSize(11).fillColor(C.lightGrey).text(k.desc, 75, ky + 55, { width: W - 150 });
});

doc.rect(50, 635, W - 100, 100).fill(C.blue);
doc.font('Helvetica-Bold').fontSize(20).fillColor(C.dark).text('L\'action la plus importante maintenant :', 50, 650, { align: 'center', width: W - 100 });
doc.font('Helvetica-Bold').fontSize(15).fillColor(C.dark).text('Répondez "OUI" à l\'email reçu → Audit gratuit de 30 min', 50, 680, { align: 'center', width: W - 100 });

doc.font('Helvetica').fontSize(9).fillColor(C.grey).text('© 2024 SalesHunter · Tous droits réservés · contact@saleshunter.fr', 50, H - 45, { align: 'center', width: W - 100 });
doc.font('Helvetica').fontSize(9).fillColor(C.grey).text('Ce guide est confidentiel. Toute reproduction sans autorisation est interdite.', 50, H - 30, { align: 'center', width: W - 100 });

doc.end();
console.log(`✅ PDF généré avec succès : ${outPath}`);
