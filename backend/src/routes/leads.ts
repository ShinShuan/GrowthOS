import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { createLead } from '../services/airtable';
import { sendPdfEmail } from '../services/email';

const router = Router();

const leadSchema = z.object({
    nom: z.string().min(2, 'Nom trop court'),
    email: z.string().email('Email invalide'),
    telephone: z.string().min(10, 'Numéro invalide'),
    agence: z.string().optional(),
    rgpd: z.boolean().refine(val => val === true, 'Vous devez accepter la politique RGPD'),
});

router.post('/', async (req: Request, res: Response) => {
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
        const airtableRecord = await createLead({ nom, email, telephone, agence: agence || '' });
        console.log(`✅ Lead créé dans Airtable: ${airtableRecord.id}`);

        // 2. Send PDF by email (wrapped in try/catch to avoid crashing if SMTP is not set)
        try {
            await sendPdfEmail({ nom, email });
            console.log(`📧 Email envoyé à: ${email}`);
        } catch (emailError) {
            console.error('⚠️ Erreur lors de l\'envoi de l\'email (SMTP non configuré ou PDF manquant):', emailError);
            // On continue quand même ici car le lead est créé
        }

        return res.status(200).json({
            success: true,
            message: 'Lead enregistré avec succès !',
        });

    } catch (error: any) {
        console.error('❌ Erreur critique lors de la création du lead:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Une erreur serveur est survenue.',
        });
    }
});

export default router;
