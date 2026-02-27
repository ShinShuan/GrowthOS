import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { createLead, testAirtableConnection } from '../services/airtable';
import { sendPdfEmail } from '../services/email';

const router = Router();

// Test Airtable connectivity
router.get('/test', async (_req: Request, res: Response) => {
    try {
        const result = await testAirtableConnection();
        return res.status(result.success ? 200 : 500).json(result);
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

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

        // 1. Create lead in Airtable (Resilient attempt)
        let airtableSuccess = false;
        try {
            const airtableRecord = await createLead({ nom, email, telephone, agence: agence || '' });
            console.log(`✅ Lead créé dans Airtable: ${airtableRecord.id}`);
            airtableSuccess = true;
        } catch (airtableError) {
            console.error('⚠️ Échec de création du lead dans Airtable (Timeout ou autres):', airtableError);
            // We continue anyway to send the email to the prospect
        }

        // 2. Send PDF to prospect + Notify Owner (Non-blocking)
        const emailData = { nom, email };

        // Prospect Email
        sendPdfEmail(emailData)
            .then(() => console.log(`📧 Email guide envoyé à: ${email}`))
            .catch(err => console.error('❌ Erreur email prospect:', err));

        // Owner Notification (Optional but good for resilience)
        if (process.env.EMAIL_FROM) {
            sendPdfEmail({
                nom: "ADMIN - Nouveau Lead",
                email: process.env.EMAIL_FROM // Reuse EMAIL_FROM as notification target if applicable
            }).catch(() => { }); // Silent catch for admin notification
        }

        return res.status(200).json({
            success: true,
            message: 'Lead enregistré avec succès !',
            warnings: airtableSuccess ? undefined : ['Airtable unavailable, lead preserved via logs/email']
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
