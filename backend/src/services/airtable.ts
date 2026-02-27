import Airtable from 'airtable';
import dotenv from 'dotenv';

dotenv.config();

const TABLE = process.env.AIRTABLE_TABLE_NAME || 'Nouvelle Table';

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
    console.log(`[Airtable] Attempting to create lead in table: ${TABLE}`);

    try {
        const record = await base(TABLE).create([
            {
                fields: {
                    "Name": data.nom,
                    "Description": `Email: ${data.email}\nTéléphone: ${data.telephone}\nAgence: ${data.agence}\nDate: ${new Date().toLocaleString()}`,
                    "Status": "Draft" // Matching user's "Sélection unique (Draft, Active, Completed)"
                },
            },
        ]);
        return record[0];
    } catch (error: any) {
        console.error('[Airtable Error]', error);
        // Provide more context in the error message for debugging
        if (error.error === 'NOT_FOUND') {
            throw new Error(`Table "${TABLE}" non trouvée. Vérifiez AIRTABLE_TABLE_NAME dans Vercel.`);
        }
        if (error.error === 'INVALID_VALUE_FOR_COLUMN') {
            throw new Error(`Colonnes Airtable incorrectes. Assurez-vous d'avoir "Name" et "Description".`);
        }
        throw error;
    }
}

export async function updateLeadStatus(recordId: string, statut: string) {
    const base = getBase();
    const record = await base(TABLE).update(recordId, {
        Statut: statut,
    });
    return record;
}
