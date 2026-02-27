"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const airtable_1 = require("../services/airtable");
const email_1 = require("../services/email");
const router = (0, express_1.Router)();
const leadSchema = zod_1.z.object({
    nom: zod_1.z.string().min(2, 'Nom trop court'),
    email: zod_1.z.string().email('Email invalide'),
    telephone: zod_1.z.string().min(10, 'Numéro invalide'),
    agence: zod_1.z.string().optional(),
    rgpd: zod_1.z.boolean().refine(val => val === true, 'Vous devez accepter la politique RGPD'),
});
router.post('/', async (req, res) => {
    try {
        // Validate input
        const result = leadSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                errors: result.error.flatten().fieldErrors,
            });
        }
        const { nom, email, telephone, agence } = result.data;
        // 1. Create lead in Airtable
        const airtableRecord = await (0, airtable_1.createLead)({ nom, email, telephone, agence: agence || '' });
        console.log(`✅ Lead créé dans Airtable: ${airtableRecord.id}`);
        // 2. Send PDF by email (wrapped in try/catch to avoid crashing if SMTP is not set)
        try {
            await (0, email_1.sendPdfEmail)({ nom, email });
            console.log(`📧 Email envoyé à: ${email}`);
        }
        catch (emailError) {
            console.error('⚠️ Erreur lors de l\'envoi de l\'email (SMTP non configuré ou PDF manquant):', emailError);
            // On continue quand même ici car le lead est créé
        }
        return res.status(200).json({
            success: true,
            message: 'Lead enregistré avec succès !',
        });
    }
    catch (error) {
        console.error('❌ Erreur critique lors de la création du lead:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Une erreur est survenue. Veuillez réessayer.',
        });
    }
});
exports.default = router;
