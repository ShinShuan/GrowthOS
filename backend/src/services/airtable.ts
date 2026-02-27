import Airtable from 'airtable';
import dotenv from 'dotenv';

dotenv.config();

const TABLE = process.env.AIRTABLE_TABLE_NAME || 'Nouvelle Table';

function getBase() {
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;

    if (!apiKey || !baseId) {
        throw new Error('Configuration manquante : AIRTABLE_API_KEY ou AIRTABLE_BASE_ID est vide.');
    }

    // Validation basique des formats
    if (!apiKey.startsWith('pat.')) {
        console.warn('⚠️ AIRTABLE_API_KEY ne semble pas être un jeton (PAT) valide (devrait commencer par "pat.")');
    }
    if (!baseId.startsWith('app')) {
        throw new Error(`AIRTABLE_BASE_ID invalide : "${baseId}". Un ID de base Airtable doit commencer par "app".`);
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
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Airtable a mis trop de temps à répondre (Timeout 8s)')), 8000)
        );

        // Create record with exact fields from the screenshot
        const createRecord = () => base(TABLE).create([
            {
                fields: {
                    "Nom": data.nom || "Client",
                    "Email": data.email || "",
                    "Téléphone": data.telephone || "",
                    "Agence": data.agence || ""
                },
            },
        ]);

        const records = await Promise.race([createRecord(), timeoutPromise]) as any;
        return records[0];
    } catch (error: any) {
        console.error('[Airtable Error Details]', {
            message: error.message,
            statusCode: error.statusCode,
            type: error.type,
            error: error.error
        });

        if (error.statusCode === 404 || error.error === 'NOT_FOUND') {
            throw new Error(`Ressource Airtable non trouvée. Vérifiez que la table "${TABLE}" existe.`);
        }
        if (error.statusCode === 401 || error.statusCode === 403) {
            throw new Error(`Erreur d'authentification Airtable (401/403). Vérifiez votre API KEY.`);
        }
        throw new Error(`Airtable Error: ${error.message || 'Erreur inconnue'}`);
    }
}

export async function updateLeadStatus(recordId: string, statut: string) {
    const base = getBase();
    const record = await base(TABLE).update(recordId, {
        Statut: statut,
    });
    return record;
}

export async function testAirtableConnection() {
    try {
        const base = getBase();
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout de connexion à Airtable (8s)')), 8000)
        );
        // Try to fetch just one record to verify connectivity
        const fetchPromise = base(TABLE).select({ maxRecords: 1 }).firstPage();

        await Promise.race([fetchPromise, timeoutPromise]);
        return {
            success: true,
            message: "Connexion à Airtable établie avec succès.",
            config: {
                hasApiKey: !!process.env.AIRTABLE_API_KEY,
                hasBaseId: !!process.env.AIRTABLE_BASE_ID,
                tableName: TABLE
            }
        };
    } catch (error: any) {
        console.error('[Airtable Connectivity Test Failed]', error);
        return {
            success: false,
            message: `Échec de connexion : ${error.message}`,
            config: {
                hasApiKey: !!process.env.AIRTABLE_API_KEY,
                hasBaseId: !!process.env.AIRTABLE_BASE_ID,
                tableName: TABLE
            },
            details: {
                statusCode: error.statusCode,
                type: error.type
            }
        };
    }
}

