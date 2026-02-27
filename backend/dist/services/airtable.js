"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLead = createLead;
exports.updateLeadStatus = updateLeadStatus;
const airtable_1 = __importDefault(require("airtable"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const TABLE = process.env.AIRTABLE_TABLE_NAME || 'Nouvelle Table';
function getBase() {
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    if (!apiKey || !baseId) {
        throw new Error('Missing Airtable env vars: AIRTABLE_API_KEY and AIRTABLE_BASE_ID are required.');
    }
    return new airtable_1.default({ apiKey }).base(baseId);
}
async function createLead(data) {
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
    }
    catch (error) {
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
async function updateLeadStatus(recordId, statut) {
    const base = getBase();
    const record = await base(TABLE).update(recordId, {
        Statut: statut,
    });
    return record;
}
