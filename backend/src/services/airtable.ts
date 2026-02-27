import Airtable from 'airtable';
import dotenv from 'dotenv';

dotenv.config();

const TABLE = process.env.AIRTABLE_TABLE_NAME || 'Nouvelle Table';

function getBase() {
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;

    console.log('[Airtable Config] API Key exists:', !!apiKey);
    console.log('[Airtable Config] Base ID:', baseId);
    console.log('[Airtable Config] Table Name:', TABLE);

    if (!apiKey || !baseId) {
        throw new Error('Variables d\'environnement Airtable manquantes : AIRTABLE_API_KEY ou AIRTABLE_BASE_ID.');
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
        // Add a timeout to Airtable creation to avoid hanging the function
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Airtable a mis trop de temps à répondre (Timeout)')), 6000)
        );

        const recordPromise = base(TABLE).create([
            {
                fields: {
                    "Name": data.nom,
                    "Description": `Email: ${data.email}\nTéléphone: ${data.telephone}\nAgence: ${data.agence}\nDate: ${new Date().toLocaleString()}`,
                    "Status": "Draft" // Matching user's "Sélection unique (Draft, Active, Completed)"
                },
            },
        ]);

        const record = await Promise.race([recordPromise, timeoutPromise]) as Airtable.Records<Airtable.FieldSet>;
        return record[0];
    } catch (error: any) {
        console.error('[Airtable Error Details]', {
            message: error.message,
            statusCode: error.statusCode,
            type: error.type,
            error: error.error
        });

        if (error.statusCode === 404 || error.error === 'NOT_FOUND') {
            throw new Error(`Ressource Airtable non trouvée. Vérifiez que la table "${TABLE}" et le Base ID sont corrects.`);
        }
        if (error.statusCode === 401 || error.statusCode === 403) {
            throw new Error(`Erreur d'authentification Airtable. Vérifiez votre API KEY.`);
        }
        if (error.error === 'INVALID_VALUE_FOR_COLUMN' || error.statusCode === 422) {
            throw new Error(`Données invalides pour Airtable. Vérifiez que les colonnes "Name" et "Description" existent.`);
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
