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
const base = new airtable_1.default({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID || '');
const TABLE = process.env.AIRTABLE_TABLE_NAME || 'Leads';
async function createLead(data) {
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
    const record = await base(TABLE).update(recordId, {
        Statut: statut,
    });
    return record;
}
