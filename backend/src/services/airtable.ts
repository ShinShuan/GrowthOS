import Airtable from 'airtable';
import dotenv from 'dotenv';

dotenv.config();

const TABLE = process.env.AIRTABLE_TABLE_NAME || 'Leads';

function getBase() {
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    if (!apiKey || !baseId) {
        throw new Error('Missing Airtable env vars: AIRTABLE_API_KEY and AIRTABLE_BASE_ID are required.');
    }
    return new Airtable({ apiKey }).base(baseId);
}

export interface LeadData {
    nom: string;
    email: string;
    telephone: string;
    agence: string;
}

export async function createLead(data: LeadData) {
    const base = getBase();
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
    const base = getBase();
    const record = await base(TABLE).update(recordId, {
        Statut: statut,
    });
    return record;
}
