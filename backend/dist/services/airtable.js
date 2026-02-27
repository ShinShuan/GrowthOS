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
const TABLE = process.env.AIRTABLE_TABLE_NAME || 'Leads';
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
async function updateLeadStatus(recordId, statut) {
    const base = getBase();
    const record = await base(TABLE).update(recordId, {
        Statut: statut,
    });
    return record;
}
