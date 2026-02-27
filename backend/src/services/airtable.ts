import Airtable from 'airtable';
import dotenv from 'dotenv';

dotenv.config();

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID || ''
);

const TABLE = process.env.AIRTABLE_TABLE_NAME || 'Leads';

export interface LeadData {
    nom: string;
    email: string;
    telephone: string;
    agence: string;
}

export async function createLead(data: LeadData) {
    const record = await base(TABLE).create([
        {
            fields: {
                Nom: data.nom,
                Email: data.email,
                Téléphone: data.telephone,
                Agence: data.agence,
                Statut: 'Nouveau',
                'Date inscription': new Date().toISOString(),
                Source: 'Landing Page - Guide Gratuit',
            },
        },
    ]);
    return record[0];
}

export async function updateLeadStatus(recordId: string, statut: string) {
    const record = await base(TABLE).update(recordId, {
        Statut: statut,
    });
    return record;
}
